import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/models';
import { Comment } from '@modules/post/comments/models';
import { Post } from '@modules/post/posts/models';

@ObjectType()
export class User extends BaseModel {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [Post], { nullable: true })
  post?: Post[];

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];
}
