import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import IFileStorage from '@/modules/file/adapters/i_file_storage';
import FileLocalRepository from '@/modules/file/infra/repositories/file.repository';
import FileLocalStorage from '@/modules/file/infra/storage/file_local.storage';
import SupabaseStorage from '@/modules/file/infra/storage/supabase.storage';
import { FILE_REPOSITORY, FILE_STORAGE } from '@/modules/file/symbols';
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
        } else {
          return new SupabaseStorage(configurationService);
        }
      },
    },
    {
      inject: [FILE_STORAGE],
      provide: FILE_REPOSITORY,
      useFactory: (fileStorage: IFileStorage) =>
        new FileLocalRepository(fileStorage),
    },
  ],
  exports: [
    {
      inject: [ConfigurationService],
      provide: FILE_STORAGE,
      useFactory: configurationService =>
        new FileLocalStorage(configurationService),
    },
    {
      inject: [FILE_STORAGE],
      provide: FILE_REPOSITORY,
      useFactory: (fileStorage: IFileStorage) =>
        new FileLocalRepository(fileStorage),
    },
  ],
})
export default class FileModule {
  constructor() {}
}
