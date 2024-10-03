import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/graphql.auth-guard';

@Resolver(Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => Tenant)
  @UseGuards(JwtAuthGuard)
  async findByTenantName(@Args('username') username: string) {
    return this.tenantService.findOneByUsername(username);
  }
  @Query(() => [Tenant])
  @UseGuards(JwtAuthGuard)
  async findAllTenants(@Context() context: any) {
    console.log(context.req.user);
    return this.tenantService.findAll();
  }
}
