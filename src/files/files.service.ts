import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import PublicFile from './entities/publicFile.entity';
import { v4 as uuid } from 'uuid';
import PrivateFile from './entities/privateFile.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile) private pulicFileRepo: Repository<PublicFile>,
    @InjectRepository(PrivateFile)
    private privateFileRepo: Repository<PrivateFile>,
    private configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, fileName: string) {
    console.log({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_KEY'),
      Body: dataBuffer,
      Key: `${uuid} - ${fileName}`,
    });
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_KEY'),
        Body: dataBuffer,
        Key: `${uuid()} - ${fileName}`,
      })
      .promise();
    console.log(uploadResult);
    const newFile = await this.pulicFileRepo.create({
      url: uploadResult.Location,
      key: uploadResult.Key,
    });
    await this.pulicFileRepo.save(newFile);
    return newFile;
  }

  async uploadPrivateFile(
    ownerId: number,
    dataBuffer: Buffer,
    fileName: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_KEY'),
        Body: dataBuffer,
        Key: `${uuid()} - ${fileName}`,
      })
      .promise();
    const newFile = await this.privateFileRepo.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });
    await this.privateFileRepo.save(newFile);
    return newFile;
  }

  async getPrivateFile(fileId: number) {
    const fileInfo = await this.privateFileRepo.findOne({
      where: {
        id: fileId,
      },
      relations: ['owner'],
    });
    if (!fileInfo) {
      throw new NotFoundException('File not found');
    }
    console.log(
      {
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_KEY'),
        Key: fileInfo.key,
      },
      fileInfo,
    );
    const s3 = new S3();
    const stream = await s3
      .getObject({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_KEY'),
        Key: fileInfo.key,
      })
      .createReadStream();
    return {
      stream,
      fileInfo,
    };
  }

  async generatePresignUrl(key: string) {
    const s3 = new S3();
    const url = await s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_KEY'),
      Key: key,
    });
    return url;
  }
}
