import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum Actions {
  LOG_IN = 'log in',
  SIGN_UP = 'sign up',
}
export enum Roles {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  OPERATOR = 'operator',
}

registerEnumType(Actions, {
  name: 'Actions',
});
registerEnumType(Roles, {
  name: 'Roles',
});

@InputType()
export class UserInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field(() => Actions, { nullable: true })
  action: Actions;
  @Field(() => Roles, { nullable: true })
  role: Roles;
}
