import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { FilesService } from 'src/files/files.service';
import PublicFile from 'src/files/entities/publicFile.entity';
import { ConfigService } from '@nestjs/config';
import PrivateFile from 'src/files/entities/privateFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PublicFile, PrivateFile])],
  controllers: [UsersController],
  providers: [UsersService, FilesService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
