import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User } from '@modules/user/users/models';
import { Post } from './models';
import { CreatePostInput } from './dtos';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<(Post & { author: User })[]> {
    return await this.prisma.post.findMany({
      include: { author: true },
    });
  }

  async create(
    input: CreatePostInput,
    authorId: number,
  ): Promise<Post & { author: User }> {
    return await this.prisma.post.create({
      data: { ...input, authorId },
      include: { author: true },
    });
  }
}
