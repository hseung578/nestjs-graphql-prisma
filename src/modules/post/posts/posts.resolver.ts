import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/interfaces';
import { User } from '@modules/user/users/models';
import { Post } from './models';
import { CreatePostInput, DeletePostInput, UpdatePostInput } from './dtos';
import { PostsService } from './posts.service';
import { PrismaService } from '@providers/prisma/prisma.service';

@Resolver()
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Post])
  getPosts(): Promise<(Post & { author: User })[]> {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Post)
  createPost(
    @CurrentUser() { sub: authorId }: JwtPayload,
    @Args('input') input: CreatePostInput,
  ): Promise<Post & { author: User }> {
    return this.postsService.create(input, authorId);
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Boolean)
  async updatePost(
    @CurrentUser() { sub: authorId }: JwtPayload,
    @Args('input') input: UpdatePostInput,
  ): Promise<boolean> {
    await this.prisma.isMine('Post', input.id, authorId);
    await this.postsService.update(input);
    return true;
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Boolean)
  async deletePost(
    @CurrentUser() { sub: authorId }: JwtPayload,
    @Args('input') input: DeletePostInput,
  ): Promise<boolean> {
    await this.prisma.isMine('Post', input.id, authorId);
    await this.postsService.delete(input.id);
    return true;
  }
}
