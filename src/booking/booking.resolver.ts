import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { BookingInput } from './dto/create_booking.dto';
import { BookingResponse } from './dto/booking_response';

@Resolver()
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => BookingResponse)
  async createBooking(@Args('bookingInput') bookingInput: BookingInput) {
    return await this.bookingService.createOne(bookingInput);
  }
}
