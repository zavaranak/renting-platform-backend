import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PendingBookingService } from '@booking/pending_booking/pending-booking.service';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from '@common/queryRelation.handler';
import { QueryManyInput, QueryParams } from '@common/query.handler';
import { QueryResponse } from '@common/reponse.type';
import { BookingInput } from '@booking/dto/create_booking.dto';
import { ActiveBookingService } from './active_booking/active-booking.service';
import { CompletedBookingService } from './completed_booking/completed-booking.service';
import { ActionStatus } from '@common/constants';
import { PendingBooking } from './pending_booking/pending-booking.entity';
import { ActiveBooking } from './active_booking/active-booking.entity';
import { CompletedBooking } from './completed_booking/completed-booking.entity';

@Resolver()
export class BookingResolver {
  constructor(
    private readonly pendingBookingService: PendingBookingService,
    private readonly activeBookingService: ActiveBookingService,
    private readonly completedBookingService: CompletedBookingService,
  ) {}

  @Mutation(() => QueryResponse, {
    description: 'Создание новой бронирования',
  })
  async createBooking(@Args('bookingInput') bookingInput: BookingInput) {
    console.log(bookingInput);
    return await this.pendingBookingService.createOne(bookingInput);
  }

  @Mutation(() => QueryResponse, {
    description: 'Подтвержение бронирования',
  })
  async activateBooking(@Args('pendingBookingId') pendingBookingId: string) {
    return await this.pendingBookingService.moveToActive(pendingBookingId);
  }

  @Mutation(() => QueryResponse, {
    description: 'Отмена бронирования в очереди',
  })
  async cancelPendingBooking(
    @Args('pendingBookingId') pendingBookingId: string,
  ) {
    return await this.pendingBookingService.moveToCompleted(pendingBookingId);
  }

  @Mutation(() => QueryResponse, {
    description: 'Отмена действующего бронирования',
  })
  async cancelActiveBooking(@Args('activeBookingId') activeBookingId: string) {
    return await this.activeBookingService.cancel(activeBookingId);
  }

  @Mutation(() => QueryResponse, {
    description: 'Завершение действующего бронирования',
  })
  async completeActiveBooking(
    @Args('activeBookingId') activeBookingId: string,
  ) {
    return await this.activeBookingService.complete(activeBookingId);
  }

  @Query(() => PendingBooking, {
    description: 'Запрос одного бронирования в очереди',
  })
  async getOnePendingBooking(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
      entityFields: fields,
    };
    const booking =
      await this.pendingBookingService.getOnePendingBooking(queryParams);
    return booking;
  }

  @Query(() => [PendingBooking], {
    description: 'Запрос множества бронирований в очереди по параметрам',
  })
  async getManyPendingBooking(
    @Info() info: GraphQLResolveInfo,
    @Args({
      name: 'query_many_input',
      type: () => QueryManyInput,
    })
    args?: QueryManyInput,
  ) {
    const { relations, fields } = getRelations(info);
    const { conditions, pagination, orderBy, selectedDate } = args;
    const queryParams: QueryParams = {
      relations: relations,
      conditions: conditions && conditions.length > 0 ? conditions : undefined,
      pagination: pagination,
      entityFields: fields,
      orders: orderBy,
    };
    return await this.pendingBookingService.getManyPendingBookings(queryParams);
  }
  @Query(() => ActiveBooking, {
    description: 'Запрос одного действующего бронирования',
  })
  async getOneActiveBooking(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
      entityFields: fields,
    };
    return await this.activeBookingService.getOneActiveBooking(queryParams);
  }

  @Query(() => [ActiveBooking], {
    description: 'Запрос множества действующих бронирований по параметрам',
  })
  async getManyActiveBooking(
    @Info() info: GraphQLResolveInfo,
    @Args({
      name: 'query_many_input',
      type: () => QueryManyInput,
    })
    args?: QueryManyInput,
  ) {
    const { relations, fields } = getRelations(info);
    const { conditions, pagination, orderBy, selectedDate } = args;
    const queryParams: QueryParams = {
      relations: relations,
      conditions: conditions && conditions.length > 0 ? conditions : undefined,
      pagination: pagination,
      entityFields: fields,
      orders: orderBy,
      selectedDate: selectedDate,
    };
    return await this.activeBookingService.getManyActiveBookings(queryParams);
  }
  @Query(() => CompletedBooking, {
    description: 'Запрос одного завершенного бронирования',
  })
  async getOneCompletedBooking(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
      entityFields: fields,
    };
    return await this.completedBookingService.getOneCompletedBooking(
      queryParams,
    );
  }

  @Query(() => [CompletedBooking], {
    description: 'Запрос множества завершенных бронирований по параметрам',
  })
  async getManyCompletedBooking(
    @Info() info: GraphQLResolveInfo,
    @Args({
      name: 'query_many_input',
      type: () => QueryManyInput,
    })
    args?: QueryManyInput,
  ) {
    const { relations, fields } = getRelations(info);
    const { conditions, pagination, orderBy, selectedDate } = args;
    const queryParams: QueryParams = {
      relations: relations,
      conditions: conditions && conditions.length > 0 ? conditions : undefined,
      pagination: pagination,
      entityFields: fields,
      orders: orderBy,
      selectedDate: selectedDate,
    };
    return await this.completedBookingService.getManyCompletedBookings(
      queryParams,
    );
  }
}
