import { Resolver, Query, Args, Info } from '@nestjs/graphql';
import { Landlord } from './landlord.entity';
import { LandlordService } from './landlord.service';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams } from 'src/common/query_function';
@Resolver(Landlord)
export class LandlordResolver {
  constructor(private landlordService: LandlordService) {}

  // @Query(() => Landlord)
  // async findByLandlordName(@Args('username') username: string) {
  //   try {
  //     return await this.landlordService.findOneByUsername(username);
  //   } catch (error) {
  //     console.error('An error occurred while finding Landlord by usename');
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(
  //       'An error occurred while finding Landlord',
  //     );
  //   }
  // }

  // @Query(() => [Landlord])
  // async findAllLandlords() {
  //   return await this.landlordService.findAll();
  // }
  @Query(() => Landlord)
  async getOneLandlord(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info,
  ) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations,
    };
    return await this.landlordService.getOne(queryParams);
  }

  @Query(() => [Landlord])
  async getAllLandlord(@Info() info: GraphQLResolveInfo) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations,
    };
    return await this.landlordService.getMany(queryParams);
  }
}
