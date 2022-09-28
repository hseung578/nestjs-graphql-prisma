import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/interfaces';
import { User } from '@modules/user/users/models';
import { Post } from './models';
import { CreatePostInput, DeletePostInput } from './dtos';
import { PostsService } from './posts.service';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

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
  @Mutation(() => Post)
  deletePost(@Args('input') input: DeletePostInput): Promise<Post> {
    return this.postsService.delete(input.id);
  }
}
