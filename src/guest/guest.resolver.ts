import { Resolver, Query, Args, Info, Mutation } from '@nestjs/graphql';

import { Guest } from './guest.entity';
import GuestService from './guest.service';
import { CreateGuestInput, UpdateGuestInput } from './dto/guest.input';
import { QueryParams } from '@common/query.handler';
import { QueryResponse } from '@common/reponse.type';

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
  @Query(() => QueryResponse, { nullable: true })
  async getGuests(
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<QueryResponse> {
    const queryParams: QueryParams = { queryType: type, queryValue: value };
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
