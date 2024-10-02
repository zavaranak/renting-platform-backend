import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceResponse } from './dto/place_response';
import { PlaceInput } from './dto/create-place.dto';
// import { Place } from './place.entity';

@Resolver()
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Mutation(() => PlaceResponse)
  async createPlace(@Args('placeInput') placeInput: PlaceInput) {
    console.log(placeInput);
    return await this.placeService.createOne(placeInput);
  }
}
