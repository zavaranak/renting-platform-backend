import { Field, ObjectType } from '@nestjs/graphql';
import { ActionStatus } from './constants';

@ObjectType()
export class QueryResponse {
  @Field()
  message: string;
  @Field(() => ActionStatus)
  type: ActionStatus;
}
