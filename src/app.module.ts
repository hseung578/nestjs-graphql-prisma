import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppConfigModule } from '@config/app';

import { RedisModule } from '@providers/cache/redis';
import { PrismaModule } from '@providers/prisma';
import { GraphqlModule } from '@providers/graphql';
import { PostModule } from '@modules/post/post.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    PostModule,
    UserModule,
    RedisModule,
    GraphqlModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
