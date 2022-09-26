import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
