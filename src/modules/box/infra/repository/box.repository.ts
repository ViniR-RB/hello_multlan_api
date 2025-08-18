import { AsyncResult } from '@/core/types/async_result';
import SummaryBoxReadModel from '@/modules/box/domain/read-models/summary_box_read_model';
import { BoxMapper } from '@/modules/box/infra/mapper/box_mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Either, left, right } from 'src/core/either/either';
import Nil, { nil } from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import IBoxRepository, {
  BoxSummaryQueryResult,
} from '../../adapters/i_box_repository';
import BoxEntity from '../../domain/box.entity';
import { default as SummaryBoxReadModelMapper } from '../mapper/summary_box_read_model.mapper';
import BoxModel from '../model/box.model';

export default class BoxRepository implements IBoxRepository {
  constructor(
    @InjectRepository(BoxModel)
    private readonly boxRepository: Repository<BoxModel>,
  ) {}
  async findByIds(
    ids: string[],
  ): AsyncResult<RepositoryException, BoxEntity[]> {
    try {
      const boxModelList = await this.boxRepository.find({
        where: { id: In(ids) },
      });

      return right(boxModelList.map(box => BoxMapper.toEntity(box)));
    } catch (e) {
      return left(new RepositoryException('Erro ao buscar caixas por IDs'));
    }
  }
  async deleteBox(id: string): AsyncResult<RepositoryException, Nil> {
    try {
      const result = await this.searchBoxFromIdOrThrow(id);
      if (result.isLeft()) {
        return left(new RepositoryException('Caixa não encontrada'));
      }
      await this.boxRepository.delete(id);
      return right(nil);
    } catch (e) {
      return left(new RepositoryException('Erro ao deletar a caixa'));
    }
  }
  async summaryBox(): AsyncResult<RepositoryException, SummaryBoxReadModel> {
    try {
      const query = await this.boxRepository.query<BoxSummaryQueryResult[]>(
        `
        WITH box_summary AS (
          SELECT
            count(*) AS total_boxes,
            coalesce(sum(array_length(string_to_array(list_users, ','), 1)), 0) AS total_customers
          FROM
            box
        ),
        box_for_zone AS (
          SELECT
            zone,
            count(*) AS zone_count,
            100.0 * count(*) / (SELECT count(*) FROM box) AS zone_percentage
          FROM
            box
          GROUP BY
            zone
        ),
        total_routes AS (
          SELECT
            count(*) AS total_routes
          FROM
            route
        )
        SELECT
          (SELECT jsonb_agg(bs) FROM box_summary bs) AS summary,
          (SELECT jsonb_agg(bfz) FROM box_for_zone bfz) AS zone_info,
          (SELECT jsonb_agg(tr) FROM total_routes tr) AS total_routes;
        `,
      );
      return right(SummaryBoxReadModelMapper.fromEntity(query[0]));
    } catch (error) {
      return left(
        new RepositoryException('Erro em Busca o Resumos das Caixas'),
      );
    }
  }
  async updateBox(
    boxEntity: BoxEntity,
  ): Promise<Either<RepositoryException, Nil>> {
    try {
      const boxdata = {
        id: boxEntity.boxId,
        latitude: boxEntity.latitude,
        longitude: boxEntity.longitude,
        label: boxEntity.label,
        freeSpace: boxEntity.freeSpace,
        filledSpace: boxEntity.filledSpace,
        signal: boxEntity.signal,
        note: boxEntity.note,
        createdAt: boxEntity.createdAt,
        updatedAt: boxEntity.updatedAt,
        listUser: boxEntity.listUser,
        zone: boxEntity.zone,
        image: boxEntity.imageUrl,
      };
      await this.boxRepository.save(boxdata);
      return right(nil);
    } catch (error) {
      return left(new RepositoryException('Erro ao salvar uma caixa'));
    }
  }
  async searchBoxFromIdOrThrow(
    id: string,
  ): Promise<Either<RepositoryException, BoxModel>> {
    try {
      const boxSearch = await this.boxRepository.findOneByOrFail({ id });
      return right(boxSearch);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(new RepositoryException('Caixa não encontrada'));
      }
    }
  }
  async getAllBoxs(): Promise<Either<RepositoryException, BoxModel[]>> {
    try {
      const boxList = await this.boxRepository.find();
      return right(boxList);
    } catch (error) {
      return left(new RepositoryException('Erro ao Pegar todas as caixas'));
    }
  }
  async createBox(
    boxEntity: BoxEntity,
  ): Promise<Either<RepositoryException, Nil>> {
    try {
      const boxdata = {
        ...boxEntity.toObject(),
      };

      await this.boxRepository.save(boxdata);
      return right(nil);
    } catch (error) {
      return left(new RepositoryException('Erro ao salvar uma caixa'));
    }
  }
}
