import { Module } from '@nestjs/common';
import { PrismaModule } from '@providers/prisma';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  imports: [PrismaModule],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
