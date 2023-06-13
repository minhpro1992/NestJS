import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [CsvController],
  providers: [CsvService, MulterConfigService],
})
export class CsvModule {}
