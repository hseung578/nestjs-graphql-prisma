import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class DeletePostInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  id: number;
}
