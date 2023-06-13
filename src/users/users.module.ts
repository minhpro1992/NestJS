import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { FilesService } from 'src/files/files.service';
import PublicFile from 'src/files/entities/publicFile.entity';
import { ConfigService } from '@nestjs/config';
import PrivateFile from 'src/files/entities/privateFile.entity';
import { LocalFile } from 'src/local-files/entities/local-file.entity';
import { LocalFilesService } from 'src/local-files/local-files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PublicFile, PrivateFile, LocalFile]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FilesService, ConfigService, LocalFilesService],
  exports: [UsersService],
})
export class UsersModule {}
