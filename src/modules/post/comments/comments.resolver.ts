import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@auth/guards';
import { CommentsService } from './comments.service';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/interfaces';
import { CreateCommentInput, createReplyInput, getCommentInput } from './dtos';
import { Comment } from './models';
import { User } from '@modules/user/users/models';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [Comment])
  getComments(
    @Args('input') input: getCommentInput,
  ): Promise<(Comment & { author: User })[]> {
    return this.commentsService.findAllByPostId(input.postId);
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @CurrentUser() { sub: UserId }: JwtPayload,
    @Args('input') input: CreateCommentInput,
  ): Promise<Comment & { author: User }> {
    return this.commentsService.comment(input, UserId);
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Comment)
  createReply(
    @CurrentUser() { sub: UserId }: JwtPayload,
    @Args('input') input: createReplyInput,
  ): Promise<Comment & { author: User }> {
    return this.commentsService.reply(input, UserId);
  }
}
