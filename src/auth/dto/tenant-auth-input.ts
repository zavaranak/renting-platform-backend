import { Field, InputType } from '@nestjs/graphql';

export enum Actions {
  LOG_IN = 'log in',
  SIGN_UP = 'sign up',
}

@InputType()
export class TenantInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  action: string;
}
