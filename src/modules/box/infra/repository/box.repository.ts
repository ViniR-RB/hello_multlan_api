import { InjectRepository } from '@nestjs/typeorm';
import { Either, left, right } from 'src/core/either/either';
import Nil, { nil } from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import { Repository } from 'typeorm';
import IBoxRepository from '../../adapters/i_box_repository';
import BoxEntity from '../../domain/box.entity';
import BoxModel from '../model/box.model';

export default class BoxRepository implements IBoxRepository {
  constructor(
    @InjectRepository(BoxModel)
    private readonly boxRepository: Repository<BoxModel>,
  ) {}
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
        ...boxEntity,
        latitude: boxEntity.latitude,
        longitude: boxEntity.longitude,
        freeSpace: boxEntity.freeSpace,
        filledSpace: boxEntity.filledSpace,
        createdAt: boxEntity.createdAt,
        updatedAt: boxEntity.updatedAt,
      };
      await this.boxRepository.save(boxdata);
      return right(nil);
    } catch (error) {
      return left(new RepositoryException('Erro ao salvar uma caixa'));
    }
  }
}
