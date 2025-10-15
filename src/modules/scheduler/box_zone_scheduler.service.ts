import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import IGetConfigByKeyUseCase from '@/modules/config/domain/usecases/i_get_config_by_key_use_case';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import ICountOccurrencesByTypeUseCase from '@/modules/occurence/domain/usecases/i_count_occurrences_by_type_use_case';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export default class BoxZoneSchedulerService {
  private readonly logger = new Logger(BoxZoneSchedulerService.name);

  constructor(
    private readonly getConfigByKeyUseCase: IGetConfigByKeyUseCase,
    private readonly countOccurrencesByTypeUseCase: ICountOccurrencesByTypeUseCase,
    private readonly boxRepository: IBoxRepository,
    private readonly occurrenceRepository: IOcurrenceRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleBoxZoneUpdate() {
    this.logger.log('🔄 Iniciando verificação de zonas das boxes...');

    try {
      // 1. Buscar o occurrence_type_schedule_id das configs
      const occurrenceTypeConfigResult =
        await this.getConfigByKeyUseCase.execute({
          key: 'occurrence_type_schedule_id',
        });

      if (occurrenceTypeConfigResult.isLeft()) {
        this.logger.error(
          '❌ Erro ao buscar occurrence_type_schedule_id:',
          occurrenceTypeConfigResult.value.message,
        );
        return;
      }

      const occurrenceTypeId = String(
        occurrenceTypeConfigResult.value.config.config.value,
      );

      // 2. Buscar o frequence_change_zone_box das configs
      const frequenceConfigResult = await this.getConfigByKeyUseCase.execute({
        key: 'frequence_change_zone_box',
      });

      if (frequenceConfigResult.isLeft()) {
        this.logger.error(
          '❌ Erro ao buscar frequence_change_zone_box:',
          frequenceConfigResult.value.message,
        );
        return;
      }

      const threshold = Number(frequenceConfigResult.value.config.config.value);

      // 3. Calcular período (início e fim do mês atual)
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      this.logger.log(
        `📊 Verificando ocorrências do tipo ${occurrenceTypeId} entre ${startDate.toISOString()} e ${endDate.toISOString()}`,
      );
      this.logger.log(`⚠️ Limite configurado: ${threshold} ocorrências`);

      // 4. Buscar os boxIds únicos que tiveram ocorrências no período
      const boxIdsResult =
        await this.occurrenceRepository.findBoxIdsWithOccurrencesByType(
          occurrenceTypeId,
          startDate,
          endDate,
        );

      if (boxIdsResult.isLeft()) {
        this.logger.error(
          '❌ Erro ao buscar boxIds com ocorrências:',
          boxIdsResult.value.message,
        );
        return;
      }

      const boxIdsWithOccurrences = boxIdsResult.value;

      if (boxIdsWithOccurrences.length === 0) {
        this.logger.log(
          '✅ Nenhuma box com ocorrências no período. Nada a fazer.',
        );
        return;
      }

      this.logger.log(
        `📦 Encontradas ${boxIdsWithOccurrences.length} boxes com ocorrências`,
      );

      let updatedCount = 0;

      // 5. Para cada boxId, buscar a box e verificar quantidade de occurrences
      for (const boxId of boxIdsWithOccurrences) {
        const boxResult = await this.boxRepository.findOne({ boxId });

        if (boxResult.isLeft()) {
          this.logger.error(
            `❌ Erro ao buscar box ${boxId}:`,
            boxResult.value.message,
          );
          continue;
        }

        const box = boxResult.value;

        const countResult = await this.countOccurrencesByTypeUseCase.execute({
          occurrenceTypeId,
          startDate,
          endDate,
          boxId: box.id,
        });

        if (countResult.isLeft()) {
          this.logger.error(
            `❌ Erro ao contar occurrences da box ${box.id}:`,
            countResult.value.message,
          );
          continue;
        }

        const count = countResult.value.count;
        const currentZone = box.zone;

        this.logger.log(
          `📊 Box ${box.label} (${box.id}): ${count} ocorrências, zona atual: ${currentZone}`,
        );

        // 6. Se ultrapassou o threshold, mudar a zona
        if (count > threshold) {
          let newZone: BoxZone | null = null;

          if (currentZone === BoxZone.SAFE) {
            newZone = BoxZone.MODERATE;
          } else if (currentZone === BoxZone.MODERATE) {
            newZone = BoxZone.DANGER;
          }

          if (newZone) {
            this.logger.warn(
              `⚠️ Box ${box.label} ultrapassou o limite! Mudando de ${currentZone} para ${newZone}`,
            );

            box.updateBox({ zone: newZone });
            const saveResult = await this.boxRepository.save(box);

            if (saveResult.isLeft()) {
              this.logger.error(
                `❌ Erro ao atualizar zona da box ${box.id}:`,
                saveResult.value.message,
              );
            } else {
              updatedCount++;
              this.logger.log(
                `✅ Box ${box.label} atualizada com sucesso para zona ${newZone}`,
              );
            }
          } else {
            this.logger.log(
              `ℹ️ Box ${box.label} já está na zona ${BoxZone.DANGER}, não será alterada`,
            );
          }
        }
      }

      this.logger.log(
        `✅ Verificação concluída! ${updatedCount} boxes atualizadas.`,
      );
    } catch (error) {
      this.logger.error('❌ Erro inesperado no scheduler:', error);
    }
  }
}
