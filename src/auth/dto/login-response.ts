import { ObjectType, Field } from '@nestjs/graphql';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@ObjectType()
export class LogInResponseTenant {
  @Field({ nullable: true })
  message?: string;
  @Field({ nullable: true })
  user?: Tenant;
  @Field({ nullable: true })
  access_token?: string;
}
