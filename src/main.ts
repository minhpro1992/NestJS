import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'aws-sdk';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  config.update({
    region: configService.get('AWS_REGION'),
    secretAccessKey: configService.get('AWS_ACCESS_KEY'),
    accessKeyId: configService.get('AWS_SECRET_ACCESS_KEY'),
    // s3ForcePathStyle: true,
    // s3BucketEndpoint: false,
    // correctClockSkew: true,
    // httpOptions: {
    //   timeout: 900000,
    // },
    // useDualstackEndpoint: true,
  });
  await app.listen(configService.get('PORT') || 5000);
}
bootstrap();
