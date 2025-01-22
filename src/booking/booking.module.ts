import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { PlaceModule } from 'src/place/place.module';
import { BookingResolver } from '@booking/booking.resolver';
import { ActiveBookingService } from '@booking/active_booking/active-booking.service';
import { PendingBookingService } from '@booking/pending_booking/pending-booking.service';
import { CompletedBookingService } from '@booking/completed_booking/completed-booking.service';
@Module({
  imports: [DatabaseModule, TenantModule, PlaceModule],
  providers: [
    BookingResolver,
    PendingBookingService,
    ActiveBookingService,
    CompletedBookingService,
  ],
  exports: [
    PendingBookingService,
    ActiveBookingService,
    CompletedBookingService,
  ],
})
export class BookingModule {}
