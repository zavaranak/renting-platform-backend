import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { BookingInput } from './dto/create_booking.dto';
import { BookingResponse } from './dto/booking_response';
import { Booking } from './booking.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';

@Resolver(Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  // @Query(() => [Booking])
  // async getBookings(@Info() info: GraphQLResolveInfo) {
  //   const relations = this.getRelations(info);
  //   return this.bookingService.findAll(relations);
  // }

  // @Query(() => Booking)
  // async getBookingById(
  //   @Args('id') id: string,
  //   @Info() info: GraphQLResolveInfo,
  // ) {
  //   const relations = this.getRelations(info);
  //   return this.bookingService.findOneById(id, relations);
  // }

  @Mutation(() => BookingResponse)
  async createBooking(@Args('bookingInput') bookingInput: BookingInput) {
    return await this.bookingService.createOne(bookingInput);
  }

  @Query(() => Booking)
  async getOneBooking(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const relations = getRelations(info);
    return await this.bookingService.getOne(value, type, relations);
  }

  @Query(() => [Booking])
  async getAllBookings() {
    return await this.bookingService.getMany();
  }
}
