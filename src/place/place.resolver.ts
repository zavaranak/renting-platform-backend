import { Args, Mutation, Resolver, Query, Info } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceResponse } from './dto/place_response';
import { PlaceInput } from './dto/create_place.dto';
import { PlaceUpdateInput } from './dto/update_place.dto';
import { Place } from './place.entity';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(Place)
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Query(() => [Place])
  async findPlaces(@Info() info: GraphQLResolveInfo) {
    const relations = this.getRelations(info);
    return await this.placeService.findAll(relations);
  }
  @Query(() => Place)
  async findPlaceById(
    @Args('id') id: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const relations = this.getRelations(info);
    return await this.placeService.findOneById(id, relations);
  }

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

  getRelations(info: GraphQLResolveInfo) {
    const fields = this.getRequestFields(info);
    const relations = [];
    fields.includes('landlord') && relations.push('landlord');
    fields.includes('booking') && relations.push('booking');
    return relations;
  }
  getRequestFields(info: GraphQLResolveInfo) {
    return info.fieldNodes[0].selectionSet.selections.map(
      (selection: any) => selection.name.value,
    );
  }
}
