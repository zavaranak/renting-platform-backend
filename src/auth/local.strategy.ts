import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TenantService } from 'src/tenant/tenant.service';
import { Actions, Roles } from './dto/auth_input';
import { EMAIL_EXISTED, NO_ACTIONS } from 'src/common/constants';
import { RouterModule } from '@nestjs/core';
import { LandlordService } from 'src/landlord/landlord.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private tenantService: TenantService,
    private landlordService: LandlordService,
  ) {
    super({
      passReqToCallback: true,
    });
  }
  async validate(req: any, username: string, password: string) {
    const action = req.body.action;
    const role = req.body.role;
    switch (action) {
      case Actions.LOG_IN: {
        return this.logIn(username, password, role);
      }
      case Actions.SIGN_UP: {
        return this.signUp(username, password, role);
      }
      default: {
        throw new Error(NO_ACTIONS);
      }
    }
  }

  private async logIn(username: string, password: string, role: Roles) {
    let user: any;
    if (role === Roles.TENANT) {
      user = await this.tenantService.findByUsername(username);
    }
    if (role === Roles.LANDLORD) {
      user = await this.landlordService.findByUsername(username);
    }
    if (user && user.password === password) {
      const { password, ...data } = user;
      return data;
    } else throw new UnauthorizedException();
  }

  private async signUp(username: string, password: string, role: Roles) {
    let user: any;
    if (role === Roles.TENANT) {
      user = await this.tenantService.findByUsername(username);
    }
    if (role === Roles.LANDLORD) {
      user = await this.landlordService.findByUsername(username);
    }
    if (user) {
      throw new Error(EMAIL_EXISTED);
    }
    if (!user) {
      return { username: username, password: password };
    }
  }
}
