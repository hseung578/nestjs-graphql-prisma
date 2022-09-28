import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/models';

import { User } from '@modules/user/users/models';
import { Post } from '@modules/post/posts/models';

@ObjectType()
export class Comment extends BaseModel {
  @Field()
  content: string;

  @Field(() => Int, { defaultValue: 1 })
  ref: number;

  @Field(() => Int, { defaultValue: 0 })
  step: number;

  @Field(() => Int, { defaultValue: 0 })
  level: number;

  @Field(() => Int, { defaultValue: 0 })
  count: number;

  @Field(() => Int, { defaultValue: 0 })
  parentId: number;

  @Field()
  deletedAt: Date;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => Post, { nullable: true })
  post?: Post;
}
