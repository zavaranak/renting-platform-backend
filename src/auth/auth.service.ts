import { Injectable } from '@nestjs/common';
import { LogInResponseTenant } from './dto/login-response';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tenantService: TenantService,
  ) {}

  async tenantLogIn(tenant: Tenant): Promise<LogInResponseTenant> {
    const jwt = this.jwtService.sign({
      username: tenant.username,
      sub: tenant.id,
    });
    return { user: tenant, access_token: jwt };
  }

  async tenantSignUp(
    username: string,
    password: string,
  ): Promise<LogInResponseTenant> {
    const tenant = await this.tenantService.create(username, password);

    const jwt = this.jwtService.sign({
      username: tenant.username,
      sub: tenant.id,
    });
    return { user: tenant, access_token: jwt };
  }
}
