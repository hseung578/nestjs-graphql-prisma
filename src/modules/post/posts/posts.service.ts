import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User } from '@modules/user/users/models';
import { Post } from './models';
import { CreatePostInput, UpdatePostInput } from './dtos';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number): Promise<Post> {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async findAll(): Promise<(Post & { author: User })[]> {
    return await this.prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
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

  async update(input: UpdatePostInput): Promise<Post> {
    return await this.prisma.post.update({
      where: { id: input.id },
      data: { ...input },
    });
  }

  async delete(id: number): Promise<Post> {
    return await this.prisma.post.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return await this.prisma.post.count();
  }
}
