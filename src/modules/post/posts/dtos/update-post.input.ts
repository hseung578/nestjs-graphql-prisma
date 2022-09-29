import { InputType, IntersectionType, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';
import { DeletePostInput } from './delete-post.input';

@InputType()
export class UpdatePostInput extends IntersectionType(
  DeletePostInput,
  PartialType(CreatePostInput),
) {}
