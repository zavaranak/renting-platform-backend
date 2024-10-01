import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';

@Module({
  providers: [TenantResolver, TenantService],
  exports: [TenantService],
})
export class TenantModule {}
