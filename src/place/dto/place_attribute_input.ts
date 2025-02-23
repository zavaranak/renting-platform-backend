import { Field, InputType } from '@nestjs/graphql';
import { PlaceAttributeName } from 'src/common/constants';

@InputType()
export class PlaceAttributeInput {
  @Field(() => PlaceAttributeName)
  name: PlaceAttributeName;

  @Field()
  value: string;

  @Field()
  valueNumber?: number;
}
