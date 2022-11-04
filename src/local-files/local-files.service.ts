import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocalFileDto } from './dto/create-local-file.dto';
import { UpdateLocalFileDto } from './dto/update-local-file.dto';
import { LocalFile } from './entities/local-file.entity';

@Injectable()
export class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile) private localFilesRepo: Repository<LocalFile>,
  ) {}
  async createLocalFile(fileData: LocalFileDto) {
    const localFile = await this.localFilesRepo.create(fileData);
    await this.localFilesRepo.save(localFile);
    return localFile;
  }
  create(createLocalFileDto: CreateLocalFileDto) {
    return 'This action adds a new localFile';
  }

  findAll() {
    return `This action returns all localFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} localFile`;
  }

  update(id: number, updateLocalFileDto: UpdateLocalFileDto) {
    return `This action updates a #${id} localFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} localFile`;
  }
}
