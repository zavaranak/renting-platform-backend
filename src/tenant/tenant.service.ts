import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from './tenant.entity';
import { UserStatus } from 'src/common/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TenantService {
  private tenantRepository: Repository<Tenant>;

  constructor(@Inject('DATA_SOURCE_PSQL') private dataSource: DataSource) {
    this.tenantRepository = this.dataSource.getRepository(Tenant);
  }
  async findAllTenants(): Promise<Tenant[]> {
    return await this.tenantRepository.find({});
  }

  async findByUsername(username: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneBy({ username });
    return tenant;
  }

  async create(username: string, password): Promise<Tenant> {
    const newTenant = {
      username: username,
      password: password,
      createdAt: Date.now(),
      status: UserStatus.VERIFIED,
    };
    return await this.tenantRepository.save(newTenant);
  }
}
