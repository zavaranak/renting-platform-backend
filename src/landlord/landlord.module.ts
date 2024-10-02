import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordResolver } from './landlord.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [LandlordResolver, LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}
