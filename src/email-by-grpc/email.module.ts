import { Module } from '@nestjs/common';
import { EmailGrpcService } from './email.service';
import { EmailResolver } from './email.resolver';
import { TenantModule } from '@tenant/tenant.module';
import { LandlordModule } from '@landlord/landlord.module';

@Module({
  imports: [TenantModule, LandlordModule],
  providers: [EmailGrpcService, EmailResolver],
  exports: [EmailGrpcService],
})
export class EmailModule {}
