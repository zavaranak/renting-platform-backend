import { Field, InputType } from '@nestjs/graphql';
import { LandlordAttributeName } from 'src/common/constants';

@InputType()
export class LandlordAttributeInput {
  @Field(() => LandlordAttributeName)
  name: LandlordAttributeName;

  @Field()
  value: string;
}
