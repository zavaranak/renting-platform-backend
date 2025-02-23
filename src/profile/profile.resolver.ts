import { Resolver, Query, Args, Info, Mutation } from '@nestjs/graphql';

import { Profile } from './profile.entity';
import ProfileService from './profile.service';
import { CreateProfileInput, UpdateProfileInput } from './dto/profile.input';
import { QueryParams } from 'src/common/query_function';

@Resolver(Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  // Query: Get a profile by ID
  @Query(() => Profile, { nullable: true })
  async profile(
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<Profile | undefined> {
    return this.profileService.getOne({
      queryType: type,
      queryValue: value,
    });
  }

  // Query: Get all profiles
  @Query(() => [Profile])
  async profiles(
    @Args('value') value: string,
    @Args('type') type: string,
  ): Promise<Profile[]> {
    const queryParams: QueryParams = { queryType: type, queryValue: value };
    return this.profileService.getMany(queryParams);
  }

  // Mutation: Create a new profile
  @Mutation(() => Profile)
  async createProfile(
    @Args('input') input: CreateProfileInput,
  ): Promise<Profile> {
    return this.profileService.createProfile(input);
  }

  // Mutation: Update a profile
  @Mutation(() => Profile)
  async updateProfile(
    @Args('id') id: string,
    @Args('input') input: UpdateProfileInput,
  ): Promise<Profile> {
    return this.profileService.updateProfile(id, input);
  }

  // Mutation: Delete a profile
  @Mutation(() => Boolean)
  async deleteProfile(@Args('id') id: string): Promise<boolean> {
    return this.profileService.deleteProfile(id);
  }
}
