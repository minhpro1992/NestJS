import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response, Express, request } from 'express';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { LocalAuthenticationGuard } from 'src/authentication/localAuthentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import FindOneParams from 'src/files/dto/FindOneParams';
import LocalFilesInterceptor from 'src/local-files/local-files.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import FileUploadDto from './dto/file-upload.dto';
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
  addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFiles() file: Express.Multer.File,
  ) {
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
    @UploadedFiles() file: Express.Multer.File,
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

  @Post('local-files')
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/local-files',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2),
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: FileUploadDto,
  })
  async addLocalFile(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(request.user, file);
    return this.usersService.addLocalFile(request.user.id, {
      path: file.path,
      minetype: file.mimetype,
      filename: file.filename,
    });
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
