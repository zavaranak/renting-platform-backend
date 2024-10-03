import { Resolver, Query, Args } from '@nestjs/graphql';
import { Landlord } from './landlord.entity';
import { LandlordService } from './landlord.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Resolver(Landlord)
export class LandlordResolver {
  constructor(private landlordService: LandlordService) {}

  @Query(() => Landlord)
  async findByLandlordName(@Args('username') username: string) {
    try {
      return await this.landlordService.findOneByUsername(username);
    } catch (error) {
      console.error('An error occurred while finding Landlord by usename');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Landlord',
      );
    }
  }

  @Query(() => [Landlord])
  async findAllLandlords() {
    return await this.landlordService.findAll();
  }
}
