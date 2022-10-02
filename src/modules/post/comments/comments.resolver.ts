import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@auth/guards';
import { CommentsService } from './comments.service';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/interfaces';
import {
  CreateCommentInput,
  CreateReplyInput,
  DeleteCommentInput,
  GetCommentInput,
  UpdateCommentInput,
} from './dtos';
import { Comment } from './models';
import { User } from '@modules/user/users/models';
import { PrismaService } from '@providers/prisma/prisma.service';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Comment])
  getComments(
    @Args('input') input: GetCommentInput,
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
    @Args('input') input: CreateReplyInput,
  ): Promise<Comment & { author: User }> {
    return this.commentsService.reply(input, UserId);
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Boolean)
  async updateComment(
    @CurrentUser() { sub: authorId }: JwtPayload,
    @Args('input') input: UpdateCommentInput,
  ): Promise<boolean> {
    await this.prisma.isMine('Comment', input.id, authorId);
    await this.commentsService.update(input);
    return true;
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @CurrentUser() { sub: authorId }: JwtPayload,
    @Args('input') input: DeleteCommentInput,
  ): Promise<boolean> {
    await this.prisma.isMine('Comment', input.id, authorId);
    await this.commentsService.delete(input.id);
    return true;
  }

  @Mutation(() => Int)
  count() {
    return this.commentsService.count();
  }
}
