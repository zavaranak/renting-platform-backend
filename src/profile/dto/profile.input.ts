import { InputType, Field } from '@nestjs/graphql';
import { Gender } from 'src/common/constants';

@InputType()
export class CreateProfileInput {
  @Field()
  tenantId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  middleName?: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field()
  birthday: number;

  @Field()
  email: string;

  @Field()
  tel: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  middleName?: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field({ nullable: true })
  birthday?: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  tel?: string;
}
