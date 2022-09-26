import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;

  @IsInt()
  @Field(() => Int)
  postId: number;
}
