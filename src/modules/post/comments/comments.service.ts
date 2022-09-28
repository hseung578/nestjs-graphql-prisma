import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User } from '@modules/user/users/models';
import { CreateCommentInput, createReplyInput } from './dtos';
import { Comment } from './models';
import { Post } from '../posts/models';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: number): Promise<Comment & { post: Post }> {
    return await this.prisma.comment.findFirst({
      where: { id },
      include: { post: true },
    });
  }

  async findOneOrderByRef(): Promise<Comment> {
    return await this.prisma.comment.findFirst({ orderBy: { ref: 'desc' } });
  }

  async findAllByPostId(
    postId: number,
  ): Promise<(Comment & { author: User })[]> {
    return await this.prisma.comment.findMany({
      where: { postId },
      orderBy: [{ ref: 'desc' }, { step: 'asc' }],
      include: { author: true },
    });
  }

  async findAllByRef(ref: number): Promise<Comment[]> {
    return await this.prisma.comment.findMany({ where: { ref } });
  }

  async comment(
    input: CreateCommentInput,
    authorId: number,
  ): Promise<Comment & { author: User }> {
    const lastRef = await this.findOneOrderByRef();
    const data = { ...input, authorId, ref: lastRef ? lastRef.ref + 1 : null };

    return await this.prisma.comment.create({
      data,
      include: { author: true },
    });
  }

  async reply(
    input: createReplyInput,
    authorId: number,
  ): Promise<Comment & { author: User }> {
    const parentComment = await this.findOneById(input.id);
    const refGroup = await this.findAllByRef(parentComment.ref);
    const count = this.countReply(
      parentComment.id,
      parentComment.count,
      refGroup,
    );
    const maxLevel = this.getMaxLevel(
      parentComment.id,
      parentComment.level,
      refGroup,
    );
    const level: number = parentComment.level + 1;
    let step: number;

    if (level < maxLevel) {
      step = count + 1;
    } else if (level === maxLevel) {
      step = parentComment.step + parentComment.count + 1;
      await this.increaseStep(parentComment.ref, step);
    } else {
      step = parentComment.step + 1;
      await this.increaseStep(parentComment.ref, step);
    }

    await this.prisma.comment.update({
      where: { id: parentComment.id },
      data: { count: { increment: 1 } },
    });

    const data = {
      ref: parentComment.ref,
      step,
      level,
      content: input.content,
      parentId: parentComment.id,
      postId: parentComment.post.id,
      authorId,
    };

    return await this.prisma.comment.create({
      data,
      include: { author: true },
    });
  }

  countReply(parentId: number, count: number, comments: Comment[]): number {
    const refGroup = comments.filter(
      (comment) => comment.parentId === parentId && comment.count !== 0,
    );
    const filtered = comments.filter(
      (comment) => comment.parentId !== parentId && comment.count !== 0,
    );
    if (refGroup.length === 0) return count;

    return refGroup.reduce(
      (sum: number, comment: Comment) =>
        sum + this.countReply(comment.id, comment.count, filtered),
      count,
    );
  }

  getMaxLevel(parentId: number, level: number, comments: Comment[]): number {
    const refGroup = comments.filter(
      (comment) => comment.parentId === parentId,
    );
    const filtered = comments.filter(
      (comment) => comment.parentId !== parentId,
    );
    if (refGroup.length === 0) return level;

    return refGroup.reduce((maxLevel: number, comment: Comment) => {
      return maxLevel > this.getMaxLevel(comment.id, comment.level, filtered)
        ? maxLevel
        : this.getMaxLevel(comment.id, comment.level, filtered);
    }, level);
  }

  async increaseStep(ref: number, gte: number): Promise<void> {
    await this.prisma.comment.updateMany({
      where: { ref, step: { gte } },
      data: { step: { increment: 1 } },
    });
  }
}
