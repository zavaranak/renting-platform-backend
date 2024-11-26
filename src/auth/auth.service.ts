import { Injectable } from '@nestjs/common';
import { AuthResponse } from './dto/login_response';
import { Tenant } from 'src/tenant/tenant.entity';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from 'src/tenant/tenant.service';
import { Landlord } from 'src/landlord/landlord.entity';
import { LandlordService } from 'src/landlord/landlord.service';
import { Roles } from './dto/auth_input';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private landlordService: LandlordService,
    private tenantService: TenantService,
  ) {}

  async tenantLogIn(tenant: Tenant): Promise<AuthResponse> {
    const jwt = this.jwtService.sign({
      username: tenant.username,
      id: tenant.id,
      role: Roles.TENANT,
    });
    return { tenant: tenant, access_token: jwt };
  }

  async tenantSignUp(
    username: string,
    password: string,
  ): Promise<AuthResponse> {
    const tenant = await this.tenantService.createOne(username, password);

    const jwt = this.jwtService.sign({
      username: tenant.username,
      id: tenant.id,
      role: Roles.TENANT,
    });
    return { tenant: tenant, access_token: jwt };
  }

  async landlordLogIn(landlord: Landlord): Promise<AuthResponse> {
    const jwt = this.jwtService.sign({
      username: landlord.username,
      id: landlord.id,
      role: Roles.LANDLORD,
    });
    return { landlord: landlord, access_token: jwt };
  }

  async landlordSignUp(
    username: string,
    password: string,
  ): Promise<AuthResponse> {
    const landlord = await this.landlordService.createOne(username, password);

    const jwt = this.jwtService.sign({
      username: landlord.username,
      id: landlord.id,
      role: Roles.LANDLORD,
    });
    return { landlord: landlord, access_token: jwt };
  }
}
