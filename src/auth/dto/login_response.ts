import { ObjectType, Field } from '@nestjs/graphql';
import { Landlord } from 'src/landlord/landlord.entity';
import { Tenant } from 'src/tenant/tenant.entity';

@ObjectType()
export class AuthResponse {
  @Field({ nullable: true })
  message?: string;
  @Field({ nullable: true })
  tenant?: Tenant;
  @Field({ nullable: true })
  landlord?: Landlord;
  @Field({ nullable: true })
  access_token?: string;
}
