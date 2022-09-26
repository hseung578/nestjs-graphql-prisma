import { InputType, PickType } from '@nestjs/graphql';
import { CreateCommentInput } from './createComment.input';

@InputType()
export class getCommentInput extends PickType(CreateCommentInput, [
  'postId',
] as const) {}
