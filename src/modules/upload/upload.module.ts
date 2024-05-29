import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core_module';
import ConfigurationService from 'src/core/services/configuration.service';
import IUploadGateway from './adapters/i_upload_gateway';
import UploadFileService from './application/upload_file.service';
import UploadGateway from './gateway/upload.gateway';
import { UPLOAD_FILE, UPLOAD_GATEWAY } from './symbols';
@Module({
  imports: [CoreModule],

  providers: [
    {
      inject: [UPLOAD_GATEWAY],
      provide: UPLOAD_FILE,

      useFactory: (uploadGateway: IUploadGateway) =>
        new UploadFileService(uploadGateway),
    },
    {
      inject: [ConfigurationService],
      provide: UPLOAD_GATEWAY,
      useFactory: (configurationService: ConfigurationService) => {
        return new UploadGateway(configurationService);
      },
    },
  ],
  exports: [
    {
      inject: [UPLOAD_GATEWAY],
      provide: UPLOAD_FILE,

      useFactory: (uploadGateway: IUploadGateway) =>
        new UploadFileService(uploadGateway),
    },
    {
      inject: [ConfigurationService],
      provide: UPLOAD_GATEWAY,
      useFactory: (configurationService: ConfigurationService) => {
        return new UploadGateway(configurationService);
      },
    },
  ],
})
export default class UploadModule {}
