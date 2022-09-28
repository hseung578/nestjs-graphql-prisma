import { InputType, PickType } from '@nestjs/graphql';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class GetCommentInput extends PickType(CreateCommentInput, [
  'postId',
] as const) {}
