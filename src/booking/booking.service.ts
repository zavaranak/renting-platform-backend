import { Inject, Injectable } from '@nestjs/common';
import { Booking } from './booking.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BookingService {
  private bookingRepository: Repository<Booking>;
  constructor(@Inject('DATA_SOURCE_PSQL') private dataSource: DataSource) {
    this.bookingRepository = this.dataSource.getRepository(Booking);
  }
}
