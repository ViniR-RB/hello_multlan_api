import { InjectRepository } from '@nestjs/typeorm';
import { Either, left, right } from 'src/core/either/either';
import Nil, { nil } from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import { EntityNotFoundError, Repository } from 'typeorm';
import IBoxRepository from '../../adapters/i_box_repository';
import BoxEntity from '../../domain/box.entity';
import BoxModel from '../model/box.model';

export default class BoxRepository implements IBoxRepository {
  constructor(
    @InjectRepository(BoxModel)
    private readonly boxRepository: Repository<BoxModel>,
  ) {}
  async updateBox(
    boxEntity: BoxEntity,
  ): Promise<Either<RepositoryException, Nil>> {
    try {
      const boxdata = {
        id: boxEntity.boxId,
        latitude: boxEntity.latitude,
        longitude: boxEntity.longitude,
        freeSpace: boxEntity.freeSpace,
        filledSpace: boxEntity.filledSpace,
        signal: boxEntity.signal,
        note: boxEntity.note,
        createdAt: boxEntity.createdAt,
        updatedAt: boxEntity.updatedAt,
        listUser: boxEntity.listUser,
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
