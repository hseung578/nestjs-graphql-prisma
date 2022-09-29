import { InputType } from '@nestjs/graphql';
import { CreateReplyInput } from './create-reply.input';

@InputType()
export class UpdateCommentInput extends CreateReplyInput {}
