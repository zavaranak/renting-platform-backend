import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { BookingInput } from './dto/create_booking.dto';
import { Booking } from './booking.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams } from 'src/common/query_function';
import { QueryResponse } from 'src/common/reponse';
import { Condition } from 'src/common/query_function';

@Resolver(Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => QueryResponse)
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
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
    };
    return await this.bookingService.getOne(queryParams);
  }

  @Query(() => [Booking])
  async getBookings(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'conditions', type: () => [Condition], defaultValue: [] })
    conditions?: Condition[],
  ) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations ? relations : [],
      where: conditions && conditions.length > 0 ? conditions : undefined,
    };
    return await this.bookingService.getMany(queryParams);
  }
}
