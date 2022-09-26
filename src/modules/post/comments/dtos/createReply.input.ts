import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateCommentInput } from './createComment.input';

@InputType()
export class createReplyInput extends PickType(CreateCommentInput, [
  'content',
] as const) {
  @IsInt()
  @Field(() => Int, { nullable: true })
  id: number;
}
