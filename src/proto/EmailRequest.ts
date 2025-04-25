// Original file: src/proto/email.proto

import { Field, InputType } from '@nestjs/graphql';

export interface EmailRequest {
  to?: string;
  subject?: string;
  body?: string;
}

@InputType()
export class EmailRequestInput {
  @Field(() => String)
  to: string;
  @Field(() => String)
  subject: string;
  @Field(() => String)
  body: string;
}

export interface EmailRequest__Output {
  to?: string;
  subject?: string;
  body?: string;
}
