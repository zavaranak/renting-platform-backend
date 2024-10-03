import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { BookingInput } from './dto/create_booking.dto';
import { BookingResponse } from './dto/booking_response';
import { Booking } from './booking.entity';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [Booking])
  async getBookings(@Info() info: GraphQLResolveInfo) {
    const relations = this.getRelations(info);
    return this.bookingService.findAll(relations);
  }

  @Query(() => Booking)
  async getBookingById(
    @Args('id') id: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const relations = this.getRelations(info);
    return this.bookingService.findOneById(id, relations);
  }

  @Mutation(() => BookingResponse)
  async createBooking(@Args('bookingInput') bookingInput: BookingInput) {
    return await this.bookingService.createOne(bookingInput);
  }

  getRelations(info: GraphQLResolveInfo) {
    const fields = this.getRequestFields(info);
    const relations = [];
    fields.includes('tenant') && relations.push('tenant');
    fields.includes('booking') && relations.push('booking');
    return relations;
  }
  getRequestFields(info: GraphQLResolveInfo) {
    return info.fieldNodes[0].selectionSet.selections.map(
      (selection: any) => selection.name.value,
    );
  }
}
