import { Field, InputType } from '@nestjs/graphql';
import { TenantAttributeName } from 'src/common/constants';

@InputType()
export class TenantAttributeInput {
  @Field(() => TenantAttributeName)
  name: TenantAttributeName;

  @Field()
  value: string;
}
