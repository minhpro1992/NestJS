import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private filesService: FilesService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepo.create(createUserDto);
    await this.usersRepo.save(user);
    return user;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, fileName: string) {
    console.log(userId, imageBuffer, fileName);
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
  }

  async addPrivateAvatar(
    userId: number,
    imageBuffer: Buffer,
    fileName: string,
  ) {
    console.log(userId, imageBuffer, fileName);
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
  }

  async getPrivateFile(userId: number, fileId: number) {
    const { fileInfo, stream } = await this.filesService.getPrivateFile(fileId);
    if (fileInfo.owner.id === userId) {
      return stream;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
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
