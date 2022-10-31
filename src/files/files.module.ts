import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import PrivateFile from './entities/privateFile.entity';
import PublicFile from './entities/publicFile.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile, PrivateFile]), ConfigModule],
  providers: [FilesService, ConfigService],
  exports: [FilesService],
})
export class FilesModule {}
