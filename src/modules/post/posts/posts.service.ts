import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User } from '@modules/user/users/models';
import { Post } from './models';
import { CreatePostInput, UpdatePostInput } from './dtos';

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

  async update(input: UpdatePostInput, authorId: number): Promise<Post> {
    await this.prisma.isMine('Post', input.id, authorId);
    return await this.prisma.post.update({
      where: { id: input.id },
      data: { ...input },
    });
  }

  async delete(id: number, authorId: number): Promise<Post> {
    await this.prisma.isMine('Post', id, authorId);
    return await this.prisma.post.delete({ where: { id } });
  }
}
