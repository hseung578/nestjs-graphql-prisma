import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class CreateReplyInput extends PickType(CreateCommentInput, [
  'content',
] as const) {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  id: number;
}
