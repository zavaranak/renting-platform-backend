import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from './tenant.entity';
import { UserStatus } from 'src/common/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TenantService {
  private tenantRepository: Repository<Tenant>;

  constructor(@Inject('DATA_SOURCE_PSQL') private dataSource: DataSource) {
    try {
      this.tenantRepository = this.dataSource.getRepository(Tenant);
    } catch (error) {
      console.error('Error while creating tenantRepository:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while connect to Tenant Repository',
      );
    }
  }
  async findAll(): Promise<Tenant[]> {
    try {
      return await this.tenantRepository.find({});
    } catch (error) {
      console.log('An error occurred while finding all Tenants', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding all Tenants',
      );
    }
  }

  async findOneByUsername(username: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantRepository.findOneBy({ username });
      return tenant;
    } catch (error) {
      console.log('An error occurred while finding Tenant by username', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Tenant',
      );
    }
  }
  async findOneById(id: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantRepository.findOneBy({ id });
      return tenant;
    } catch (error) {
      console.log('An error occurred while finding Tenant by id', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while finding Tenant',
      );
    }
  }

  async createOne(username: string, password: string): Promise<Tenant> {
    try {
      const tenant: Tenant = {
        username: username,
        password: password,
        createdAt: Date.now(),
        status: UserStatus.VERIFIED,
      };
      return await this.tenantRepository.save(tenant);
    } catch (error) {
      console.log('An error occurred while creating Tenant', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Tenant',
      );
    }
  }
}
