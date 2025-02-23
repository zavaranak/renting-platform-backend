import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileInput, UpdateProfileInput } from './dto/profile.input';
import { queryOne, queryMany, QueryParams } from 'src/common/query_function';

@Injectable()
export default class ProfileService {
  private profileRepository: Repository<Profile>;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    console.log('Profile Service created');
    this.profileRepository = this.datasource.getRepository(Profile);
  }
  // Create a new profile
  async createProfile(input: CreateProfileInput): Promise<Profile> {
    const profile = this.profileRepository.create(input);
    return this.profileRepository.save(profile);
  }

  // Find a profile by ID
  async getOne(queryParams: QueryParams): Promise<Profile | undefined> {
    return queryOne(this.profileRepository, queryParams);
  }

  // Update a profile
  async updateProfile(id: string, input: UpdateProfileInput): Promise<Profile> {
    await this.profileRepository.update(id, input);
    return queryOne(this.profileRepository, {
      queryType: 'id',
      queryValue: id,
    });
  }

  // Delete a profile
  async deleteProfile(id: string): Promise<boolean> {
    const result = await this.profileRepository.delete(id);
    return result.affected > 0;
  }

  // Find all profiles
  async getMany(queryParams): Promise<Profile[]> {
    return queryMany(this.profileRepository, queryParams);
  }
}
