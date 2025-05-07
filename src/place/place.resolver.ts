import { Args, Mutation, Resolver, Query, Info } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceInput } from './dto/create_place.dto';
import { PlaceUpdateInput } from './dto/update_place.dto';
import { Place } from './place.entity';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from '@common/queryRelation.handler';
import { QueryParams, QueryManyInput } from '@common/query.handler';
import { QueryResponse } from '@common/reponse.type';
import { PlaceAttributeInput } from './dto/place_attribute_input';
import { AttributeUpdateInput } from '@common/updateAttribute.type';

import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import Upload from 'graphql-upload/Upload.js';

@Resolver(Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation(() => QueryResponse, {
    description: 'Создание нового места размещения',
  })
  async createPlace(@Args('placeInput') placeInput: PlaceInput) {
    return await this.placeService.createOne(placeInput);
  }

  @Mutation(() => QueryResponse, {
    description: 'Обновление места размещения',
  })
  async updatePlace(
    @Args('placeUpdateInput') placeUpdateInput: PlaceUpdateInput,
  ) {
    return await this.placeService.updateOne(placeUpdateInput);
  }

  @Query(() => Place, {
    description: 'Запрос одного места размещения',
  })
  async getOnePlace(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info,
  ) {
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      queryType: type,
      queryValue: value,
      relations: relations,
      entityFields: fields,
    };
    return await this.placeService.getOne(queryParams);
  }
  @Query(() => QueryResponse, {
    description: 'Запрос всех стран',
  })
  async getCountries() {
    return await this.placeService.getCountries();
  }
  @Query(() => QueryResponse, {
    description: 'Запрос всех городов по стране',
  })
  async getCitiesByCountryName(
    @Args({ name: 'country_name', type: () => String, nullable: true })
    country?: string,
  ) {
    return await this.placeService.getCitiesByCountry(country);
  }
  @Query(() => QueryResponse, {
    description: 'Запрос всех городов',
  })
  async getCities() {
    return await this.placeService.getCities();
  }

  @Query(() => [Place], {
    description: 'Запрос множества мест размещения по параметрам',
  })
  async getPlaces(
    @Info() info: GraphQLResolveInfo,
    @Args({
      name: 'query_many_input',
      type: () => QueryManyInput,
    })
    args?: QueryManyInput,
  ) {
    // console.log(args);
    const { conditions, pagination, orderBy, selectedDate } = args;
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations,
      conditions: conditions && conditions.length > 0 ? conditions : undefined,
      pagination: pagination,
      entityFields: fields,
      orders: orderBy,
      selectedDate: selectedDate,
    };
    return await this.placeService.getMany(queryParams);
  }

  @Mutation(() => QueryResponse, {
    description: 'Удаление места размещения',
  })
  async addPlaceAttributes(
    @Args('placeId') placeId: string,
    @Args({ name: 'placeAttributeInput', type: () => [PlaceAttributeInput] })
    placeAttributeInput: PlaceAttributeInput[],
  ) {
    return await this.placeService.addAttributes(placeId, placeAttributeInput);
  }

  @Mutation(() => QueryResponse, {
    description: 'Обновление атрибутов места размещения',
  })
  async updatePlaceAttributes(
    @Args({ name: 'attibuteUpdateInput', type: () => [AttributeUpdateInput] })
    attibuteUpdateInput: AttributeUpdateInput[],
  ) {
    return this.placeService.updateAttributes(attibuteUpdateInput);
  }

  @Mutation(() => QueryResponse, {
    description: 'Удаление атрибутов места размещения',
  })
  async removePlaceAttributes(
    @Args({ name: 'attributeIds', type: () => [String] })
    attributeIds: string[],
  ) {
    return this.placeService.deleteAttributes(attributeIds);
  }

  @Mutation(() => QueryResponse, {
    description: 'Обновление фотогафий места размещения',
  })
  async uploadPlacePhotos(
    @Args('placeId') placeId: string,
    @Args('images', { type: () => [GraphQLUpload] }) images: Upload[],
  ): Promise<QueryResponse> {
    const resolvedImages: Upload[] = await Promise.all(images);
    return await this.placeService.uploadPhotos(placeId, resolvedImages);
  }
}
