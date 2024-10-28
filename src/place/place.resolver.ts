import { Args, Mutation, Resolver, Query, Info } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceResponse } from './dto/place_response';
import { PlaceInput } from './dto/create_place.dto';
import { PlaceUpdateInput } from './dto/update_place.dto';
import { Place } from './place.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams } from 'src/common/query_function';
import { QueryResponse } from 'src/common/reponse';
import { PlaceAttributeInput } from './dto/place_attribute_input';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

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
      relations: relations,
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
  async uploadPlacePhotos(
    @Args('images', { type: () => [GraphQLUpload] }) images: Upload[],
  ): Promise<QueryResponse> {
    const resolvedImages: Upload[] = await Promise.all(images);
    return await this.placeService.uploadPhotos(resolvedImages);
  }
}
