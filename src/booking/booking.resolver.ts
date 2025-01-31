import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PendingBookingService } from '@booking/pending_booking/pending-booking.service';
import { PendingBooking } from '@booking/pending_booking/pending-booking.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams } from 'src/common/query_function';
import { QueryResponse } from 'src/common/reponse';
import { Condition } from 'src/common/query_function';
import { BookingInput } from '@booking/dto/create_booking.dto';
import { ActiveBookingService } from './active_booking/active-booking.service';
import { CompletedBookingService } from './completed_booking/completed-booking.service';

@Resolver()
export class BookingResolver {
  constructor(
    private readonly pendingBookingService: PendingBookingService,
    private readonly activeBookingService: ActiveBookingService,
    private readonly completedBookingService: CompletedBookingService,
  ) {}

  @Mutation(() => QueryResponse)
  async createBooking(@Args('bookingInput') bookingInput: BookingInput) {
    console.log(bookingInput);
    return await this.pendingBookingService.createOne(bookingInput);
  }

  @Mutation(() => QueryResponse)
  async activateBooking(@Args('pendingBookingId') pendingBookingId: string) {
    return await this.pendingBookingService.moveToActive(pendingBookingId);
  }

  @Mutation(() => QueryResponse)
  async cancelPendingBooking(
    @Args('pendingBookingId') pendingBookingId: string,
  ) {
    return await this.pendingBookingService.moveToCompleted(pendingBookingId);
  }

  @Mutation(() => QueryResponse)
  async cancelActiveBooking(@Args('activeBookingId') activeBookingId: string) {
    return await this.activeBookingService.cancel(activeBookingId);
  }

  @Mutation(() => QueryResponse)
  async completeActiveBooking(
    @Args('activeBookingId') activeBookingId: string,
  ) {
    return await this.activeBookingService.complete(activeBookingId);
  }

  // @Query(() => Booking)
  // async getOneBooking(
  //   @Args('value') value: string,
  //   @Args('type') type: string,
  //   @Info() info: GraphQLResolveInfo,
  // ) {
  //   const { relations, fields } = getRelations(info);
  //   const queryParams: QueryParams = {
  //     queryValue: value,
  //     queryType: type,
  //     relations: relations ? relations : [],
  //     entityFields: fields,
  //   };
  //   return await this.bookingService.getOne(queryParams);
  // }

  // @Query(() => [Booking])
  // async getBookings(
  //   @Info() info: GraphQLResolveInfo,
  //   @Args({ name: 'conditions', type: () => [Condition], defaultValue: [] })
  //   conditions?: Condition[],
  // ) {
  //   const { relations, fields } = getRelations(info);
  //   const queryParams: QueryParams = {
  //     relations: relations ? relations : [],
  //     entityFields: fields,
  //     conditions: conditions && conditions.length > 0 ? conditions : undefined,
  //   };
  //   return await this.bookingService.getMany(queryParams);
  // }
}
