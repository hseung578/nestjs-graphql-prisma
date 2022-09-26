import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/models';
import { User } from '@modules/user/users/models';
import { Comment } from '@modules/post/comments/models';

@ObjectType()
export class Post extends BaseModel {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];
}
