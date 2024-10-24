import { Args, Mutation, Resolver, Query, Info } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceResponse } from './dto/place_response';
import { PlaceInput } from './dto/create_place.dto';
import { PlaceUpdateInput } from './dto/update_place.dto';
import { Place } from './place.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams } from 'src/common/query_function';

@Resolver(Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation(() => PlaceResponse)
  async createPlace(@Args('placeInput') placeInput: PlaceInput) {
    return await this.placeService.createOne(placeInput);
  }

  @Mutation(() => PlaceResponse)
  async updatePlace(
    @Args('placeUpdateInput') placeUpdateInput: PlaceUpdateInput,
  ) {
    return await this.placeService.updateOne(placeUpdateInput);
  }

  @Query(() => Place)
  async getOnePlace(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info,
  ) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      queryType: type,
      queryValue: value,
      relations: relations,
    };
    return await this.placeService.getOne(queryParams);
  }

  @Query(() => [Place])
  async getAllPlaces(@Info() info: GraphQLResolveInfo) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      // queryType: type,
      // queryValue: value,
      relations: relations,
    };
    return await this.placeService.getMany(queryParams);
  }
}
