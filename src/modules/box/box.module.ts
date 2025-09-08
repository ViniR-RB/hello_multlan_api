import CoreModule from '@/core/core_module';
import CreateBoxService from '@/modules/box/application/create_box.service';
import BoxController from '@/modules/box/controller/box_controller';
import BoxModel from '@/modules/box/infra/models/box.model';
import BoxRepository from '@/modules/box/infra/repositories/box.repository';
import { BOX_REPOSITORY, CREATE_BOX_SERVICE } from '@/modules/box/symbols';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import FileModule from '@/modules/file/file.module';
import { FILE_REPOSITORY } from '@/modules/file/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [CoreModule, FileModule, TypeOrmModule.forFeature([BoxModel])],
  controllers: [BoxController],
  providers: [
    {
      inject: [getRepositoryToken(BoxModel)],
      provide: BOX_REPOSITORY,
      useFactory: (boxRepository: Repository<BoxModel>) =>
        new BoxRepository(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY, FILE_REPOSITORY],
      provide: CREATE_BOX_SERVICE,
      useFactory: (
        boxRepository: BoxRepository,
        fileRepository: IFileRepository,
      ) => new CreateBoxService(boxRepository, fileRepository),
    },
  ],
})
export default class BoxModule {
  constructor() {}
}
