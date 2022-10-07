import { InputType, PickType } from '@nestjs/graphql';
import { DeletePostInput } from './delete-post.input';

@InputType()
export class GetPostInput extends PickType(DeletePostInput, ['id']) {}
