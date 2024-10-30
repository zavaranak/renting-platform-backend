import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { PlaceModule } from 'src/place/place.module';
@Module({
  imports: [DatabaseModule, TenantModule, PlaceModule],
  providers: [BookingResolver, BookingService],
  exports: [BookingService],
})
export class BookingModule {}
