import { Args, Mutation, Resolver, Query, Info } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceInput } from './dto/create_place.dto';
import { PlaceUpdateInput } from './dto/update_place.dto';
import { Place } from './place.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import {
  Condition,
  QueryParams,
  Pagination,
  QueryManyInput,
} from 'src/common/query_function';
import { QueryResponse } from 'src/common/reponse';
import { PlaceAttributeInput } from './dto/place_attribute_input';
import { AttributeUpdateInput } from 'src/common/attribute_update_input';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import Upload from 'graphql-upload/Upload.js';

@Resolver(Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation(() => QueryResponse)
  async createPlace(@Args('placeInput') placeInput: PlaceInput) {
    return await this.placeService.createOne(placeInput);
  }

  @Mutation(() => QueryResponse)
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
  @Query(() => QueryResponse)
  async getCountries() {
    return await this.placeService.getCountries();
  }
  @Query(() => QueryResponse)
  async getCities(
    @Args({ name: 'country_name', type: () => String, nullable: true })
    country?: string,
  ) {
    return await this.placeService.getCities(country);
  }

  @Query(() => [Place])
  async getPlaces(
    @Info() info: GraphQLResolveInfo,
    @Args({
      name: 'query_many_input',
      type: () => QueryManyInput,
      defaultValue: [],
    })
    args?: QueryManyInput,
  ) {
    const { conditions, pagination } = args;
    console.log(conditions);
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations,
      where: conditions && conditions.length > 0 ? conditions : undefined,
      pagination: pagination,
    };
    return await this.placeService.getMany(queryParams);
  }

  @Mutation(() => QueryResponse)
  async addPlaceAttributes(
    @Args('placeId') placeId: string,
    @Args({ name: 'placeAttributeInput', type: () => [PlaceAttributeInput] })
    placeAttributeInput: PlaceAttributeInput[],
  ) {
    return await this.placeService.addAttributes(placeId, placeAttributeInput);
  }

  @Mutation(() => QueryResponse)
  async updatePlaceAttributes(
    @Args({ name: 'attibuteUpdateInput', type: () => [AttributeUpdateInput] })
    attibuteUpdateInput: AttributeUpdateInput[],
  ) {
    return this.placeService.updateAttributes(attibuteUpdateInput);
  }

  @Mutation(() => QueryResponse)
  async removePlaceAttributes(
    @Args({ name: 'attributeIds', type: () => [String] })
    attributeIds: string[],
  ) {
    return this.placeService.deleteAttributes(attributeIds);
  }

  @Mutation(() => QueryResponse)
  async uploadPlacePhotos(
    @Args('placeId') placeId: string,
    @Args('images', { type: () => [GraphQLUpload] }) images: Upload[],
  ): Promise<QueryResponse> {
    const resolvedImages: Upload[] = await Promise.all(images);
    return await this.placeService.uploadPhotos(placeId, resolvedImages);
  }
}
