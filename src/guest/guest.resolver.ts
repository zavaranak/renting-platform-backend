import { Resolver, Query, Args, Info, Mutation } from '@nestjs/graphql';

import { Guest } from './guest.entity';
import GuestService from './guest.service';
import { CreateGuestInput, UpdateGuestInput } from './dto/guest.input';
import { QueryManyInput, QueryParams } from '@common/query.handler';
import { QueryResponse } from '@common/reponse.type';
import { getRelations } from '@common/queryRelation.handler';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(Guest)
export class GuestResolver {
  constructor(private readonly guestService: GuestService) {}

  // Query: Get a profile by ID
  @Query(() => QueryResponse, { nullable: true })
  async getOneGuest(
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<QueryResponse> {
    return this.guestService.getOne({
      queryType: type,
      queryValue: value,
    });
  }

  // Query: Get all profiles
  @Query(() => [Guest])
  async getGuests(
    @Info() info: GraphQLResolveInfo,
    // @Args('type') type: string,
    @Args('queryManyInput') args: QueryManyInput,
  ): Promise<Guest[]> {
    const { relations, fields } = getRelations(info);
    const { conditions, pagination, orderBy } = args;
    const queryParams: QueryParams = {
      relations: relations ? relations : [],
      entityFields: fields,
      conditions: conditions && conditions.length > 0 ? conditions : undefined,
      pagination: pagination,
      orders: orderBy,
    };
    return this.guestService.getMany(queryParams);
  }

  // Mutation: Create a new profile
  @Mutation(() => QueryResponse)
  async createGuest(
    @Args('input') input: CreateGuestInput,
  ): Promise<QueryResponse> {
    return this.guestService.create(input);
  }

  // Mutation: Update a profile
  @Mutation(() => QueryResponse)
  async updateGuest(
    @Args('id') id: string,
    @Args('input') input: UpdateGuestInput,
  ): Promise<QueryResponse> {
    return this.guestService.update(id, input);
  }

  // Mutation: Delete a profile
  @Mutation(() => QueryResponse)
  async deleteGuest(@Args('id') id: string): Promise<QueryResponse> {
    return this.guestService.delete(id);
  }
}
