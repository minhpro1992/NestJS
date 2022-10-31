import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { LocalFilesModule } from './local-files/local-files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        // AWS_PUBLIC_BUCKET_KEY: Joi.string().required,
        // AWS_REGION: Joi.string().required,
        // AWS_ACCESS_KEY: Joi.string().required,
        // AWS_SECRET_ACCESS_KEY: Joi.string().required,
      }),
    }),
    DatabaseModule,
    PostsModule,
    UsersModule,
    FilesModule,
    LocalFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
