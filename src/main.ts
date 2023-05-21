import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'aws-sdk';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });
  const documentConfig = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT') || 5000);
}
bootstrap();
