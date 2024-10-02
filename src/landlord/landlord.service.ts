import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import { UserStatus } from 'src/common/constants';
import { PlaceService } from 'src/place/place.service';
import { PlaceInput } from 'src/place/dto/create-place.dto';

@Injectable()
export class LandlordService {
  private landlordRepository: Repository<Landlord>;
  private placeService: PlaceService;
  constructor(@Inject('DATA_SOURCE_PSQL') private datasource: DataSource) {
    this.landlordRepository = this.datasource.getRepository(Landlord);
  }

  async findAllLandlords(): Promise<Landlord[]> {
    return await this.landlordRepository.find();
  }

  async findByUsername(username: string): Promise<Landlord> {
    return await this.landlordRepository.findOneBy({ username });
  }
  async findById(id: string): Promise<Landlord> {
    return await this.landlordRepository.findOneBy({ id });
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

  async addPlace(placeInput: PlaceInput, landlordId: string) {
    placeInput.landlordId = landlordId;
    return await this.placeService.createOne(placeInput);
  }
}
