import { Resolver, Query, Args } from '@nestjs/graphql';
import { Landlord } from './landlord.entity';
import { LandlordService } from './landlord.service';

@Resolver(() => Landlord)
export class LandlordResolver {
  constructor(private landlordService: LandlordService) {}

  @Query(() => Landlord)
  async findByLandlordName(@Args('username') username: string) {
    return await this.landlordService.findByUsername(username);
  }

  @Query(() => [Landlord])
  async findAllLandlord() {
    return await this.landlordService.findAllLandlords;
  }
}
