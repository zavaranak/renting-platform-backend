import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import { UserStatus } from 'src/common/constants';

@Injectable()
export class LandlordService {
  private landlordRepository: Repository<Landlord>;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    this.landlordRepository = this.datasource.getRepository(Landlord);
  }

  async findAllLandlords(): Promise<Landlord[]> {
    return await this.landlordRepository.find();
  }

  async findByUsername(username: string): Promise<Landlord> {
    return await this.landlordRepository.findOneBy({ username });
  }

  async create(username: string, password: string): Promise<Landlord> {
    const newLandlord = {
      username: username,
      password: password,
      createdAt: Date.now(),
      status: UserStatus.VERIFIED,
    };
    return await this.landlordRepository.save(newLandlord);
  }
}
