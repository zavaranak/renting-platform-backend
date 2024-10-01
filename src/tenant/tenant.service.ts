import { Injectable } from '@nestjs/common';
import { Tenant, TenantStatus } from './entities/tenant.entity';

const dummy_tenants = [
  {
    id: '0',
    username: 'tenant1',
    password: 'not-secured',
    createdAt: 1301099990,
    status: TenantStatus.VERIFIED,
  },
  {
    id: '1',
    username: 'tenant2',
    password: 'not-secured',
    createdAt: 1301090400,
    status: TenantStatus.VERIFIED,
  },
];

@Injectable()
export class TenantService {
  async findAllTenants(): Promise<Tenant[]> {
    return dummy_tenants;
  }

  async findByUsername(username: string): Promise<Tenant> {
    const tenant = await dummy_tenants.find(
      (tenant) => tenant.username === username,
    );
    return tenant;
  }

  async create(username: string, password) {
    const newTenant = {
      id: username,
      username: username,
      password: password,
      createdAt: Date.now(),
      status: TenantStatus.VERIFIED,
    };
    dummy_tenants.push(newTenant);
    return newTenant;
  }
}
