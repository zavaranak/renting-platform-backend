import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  providers: [BookingResolver, BookingService],
})
export class BookingModule {}
