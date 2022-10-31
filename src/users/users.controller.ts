import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { request } from 'http';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import FindOneParams from 'src/files/dto/FindOneParams';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(@Req() request: RequestWithUser, @UploadedFiles() file: any) {
    console.log(request.file);
    return this.usersService.addAvatar(
      request.user?.id || +3,
      request.file.buffer as Buffer,
      request.file.originalname as string,
    );
  }

  @Post('private-avatar')
  @UseInterceptors(FileInterceptor('file'))
  addPrivateAvatar(
    @Req() request: RequestWithUser,
    @UploadedFiles() file: any,
  ) {
    console.log(request.file);
    return this.usersService.addPrivateAvatar(
      request.user?.id || +3,
      request.file.buffer as Buffer,
      request.file.originalname as string,
    );
  }

  @Get('files/:id')
  async getPrivateFile(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Res() res: Response,
  ) {
    const file = await this.usersService.getPrivateFile(
      request.user?.id || +3,
      +id,
    );
    return file;
    // file.stream.pipe(res);
  }

  @Get('files')
  async getAllPrivateFiles(@Req() request: RequestWithUser) {
    const files = await this.usersService.getAllPrivateFiles(
      request.user?.id || 3,
    );
    return files;
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
