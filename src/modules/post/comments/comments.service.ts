import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User } from '@modules/user/users/models';
import { CreateCommentInput, createReplyInput } from './dtos';
import { Comment } from './models';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: number): Promise<Comment> {
    return await this.prisma.comment.findFirst({
      where: { id },
      include: { post: true },
    });
  }

  async findOneOrderByRef(): Promise<Comment> {
    return await this.prisma.comment.findFirst({ orderBy: { ref: 'desc' } });
  }

  async findAllByPostId(postId: number): Promise<
    (Comment & {
      author: User;
    })[]
  > {
    return await this.prisma.comment.findMany({
      where: { postId },
      orderBy: [{ ref: 'desc' }, { step: 'asc' }],
      include: { author: true },
    });
  }

  async comment(input: CreateCommentInput, authorId: number): Promise<Comment> {
    const lastRef = await this.findOneOrderByRef();
    const data = { ...input, authorId };

    if (lastRef) {
      data['ref'] = lastRef.ref + 1;
    }

    return await this.prisma.comment.create({
      data,
      include: { author: true },
    });
  }

  async reply(input: createReplyInput, authorId: number): Promise<Comment> {
    const parentComment = await this.findOneById(input.id);
    const count =
      (await this.countReply(parentComment.id)) + parentComment.count;
    const maxLevel =
      (await this.getLevel(parentComment.id, parentComment.level)) +
      parentComment.level;
    const level = parentComment.level;
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

  async countReply(parentId: number) {
    const replys = await this.prisma.comment.findMany({ where: { parentId } });
    if (!replys) {
      return 0;
    }

    return replys.reduce(async (count: any, reply) => {
      if (reply.count > 0) {
        return count + reply.count + (await this.countReply(reply.id));
      }
      return count + reply.count;
    }, 0);
  }

  async getLevel(parentId: number, level: number) {
    const replys = await this.prisma.comment.findMany({
      where: { parentId, count: { gt: 1 } },
    });
    if (!replys) {
      return level;
    }
    return replys.reduce(async (a: any, c) => {
      if (c.level > level) {
        return await this.getLevel(c.id, c.level);
      }
      return c.level;
    }, level);
  }

  async increaseStep(ref: number, gte: number) {
    await this.prisma.comment.updateMany({
      where: { ref, step: { gte } },
      data: { step: { increment: 1 } },
    });
  }
}
