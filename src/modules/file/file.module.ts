import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import IFileStorage from '@/modules/file/adapters/i_file_storage';
import ImageConverterWebpServiceImpl from '@/modules/file/application/image_converter_webp.service';
import FileLocalRepository from '@/modules/file/infra/repositories/file.repository';
import FileLocalStorage from '@/modules/file/infra/storage/file_local.storage';
import SupabaseStorage from '@/modules/file/infra/storage/supabase.storage';
import {
  FILE_REPOSITORY,
  FILE_STORAGE,
  IMAGE_CONVERTER_WEBP_SERVICE,
} from '@/modules/file/symbols';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [
    {
      inject: [ConfigurationService],
      provide: FILE_STORAGE,
      useFactory: (configurationService: ConfigurationService) => {
        if (configurationService.get('NODE_ENV') === 'dev') {
          return new FileLocalStorage(configurationService);
        }
        return new SupabaseStorage(configurationService);
      },
    },
    {
      inject: [FILE_STORAGE],
      provide: FILE_REPOSITORY,
      useFactory: (fileStorage: IFileStorage) =>
        new FileLocalRepository(fileStorage),
    },
    {
      provide: IMAGE_CONVERTER_WEBP_SERVICE,
      useFactory: () => new ImageConverterWebpServiceImpl(),
    },
  ],
  exports: [FILE_STORAGE, FILE_REPOSITORY, IMAGE_CONVERTER_WEBP_SERVICE],
})
export default class FileModule {
  constructor() {}
}
