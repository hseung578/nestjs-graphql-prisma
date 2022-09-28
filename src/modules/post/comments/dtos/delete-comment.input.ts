import { InputType, PickType } from '@nestjs/graphql';
import { CreateReplyInput } from './create-reply.input';

@InputType()
export class DeleteCommentInput extends PickType(CreateReplyInput, [
  'id',
] as const) {}
