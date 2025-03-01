import { Module } from '@nestjs/common';
import GuestService from './guest.service';
import { DatabaseModule } from '@database/database.module';

import { GuestResolver } from './guest.resolver';
import { TenantModule } from '@tenant/tenant.module';

@Module({
  imports: [DatabaseModule, TenantModule],
  providers: [GuestService, GuestResolver],
  exports: [GuestService],
})
export class GuestModule {}
