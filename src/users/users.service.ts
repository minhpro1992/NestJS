import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalFilesService } from 'src/local-files/local-files.service';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private filesService: FilesService,
    private localFilesService: LocalFilesService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepo.create(createUserDto);
      await this.usersRepo.save(user);
      return user;
    } catch (error) {
      throw new BadRequestException('Something wrong to create new user');
    }
  }

  async addAvatar(userId: number, imageBuffer: Buffer, fileName: string) {
    console.log(userId, imageBuffer, fileName);
    try {
      const user = await this.usersRepo.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const avatar = await this.filesService.uploadPublicFile(
        imageBuffer,
        fileName,
      );
      Object.assign(user, avatar);
      await this.usersRepo.save(user);
      return user;
    } catch (error) {
      throw new Error(
        'Something went wrong to add user avatar.Please try again.',
      );
    }
  }

  async addPrivateAvatar(
    userId: number,
    imageBuffer: Buffer,
    fileName: string,
  ) {
    console.log(userId, imageBuffer, fileName);
    try {
      const user = await this.usersRepo.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const avatar = await this.filesService.uploadPrivateFile(
        userId,
        imageBuffer,
        fileName,
      );
      Object.assign(user, avatar);
      await this.usersRepo.save(user);
      return user;
    } catch (error) {
      throw new Error('Something went wrong to add private avatar');
    }
  }

  async getPrivateFile(userId: number, fileId: number) {
    const { fileInfo, stream } = await this.filesService.getPrivateFile(fileId);
    if (fileInfo.owner.id === userId) {
      return stream;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    try {
      const user = await this.usersRepo.findOne({
        where: {
          id: userId,
        },
        relations: ['files'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      console.log(user);
      if (Array.isArray(user.files) && user.files.length > 0) {
        return Promise.all(
          user.files.map(async (file) => {
            const url = await this.filesService.generatePresignUrl(file.key);
            return {
              ...file,
              url,
            };
          }),
        );
      }
    } catch (error) {
      throw new Error('Something went wrong to get all private files');
    }
  }

  async addLocalFile(userId: number, fileData: LocalFileDto) {
    const file = await this.localFilesService.createLocalFile(fileData);
    await this.usersRepo.update(userId, {
      localFileId: +file.id,
    });
    return file;
  }

  async getById(userId: number) {
    const user = await this.usersRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll() {
    return await this.usersRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
