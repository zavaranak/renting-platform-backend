import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TenantService } from 'src/tenant/tenant.service';
import { Actions } from './dto/tenant-auth-input';
import { EMAIL_EXISTED, NO_ACTIONS } from 'src/common/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private tenantService: TenantService) {
    super({
      passReqToCallback: true,
    });
  }
  async validate(req: any, username: string, password: string) {
    const action = req.body.action;

    switch (action) {
      case Actions.LOG_IN: {
        return this.logIn(username, password);
      }
      case Actions.SIGN_UP: {
        return this.signUp(username, password);
      }
      default: {
        throw new Error(NO_ACTIONS);
      }
    }
  }

  private async logIn(username: string, password: string) {
    const user = await this.tenantService.findByUsername(username);
    if (user && user.password === password) {
      const { password, ...data } = user;
      return data;
    } else throw new UnauthorizedException();
  }

  private async signUp(username: string, password: string) {
    const user = await this.tenantService.findByUsername(username);
    if (user) {
      throw new Error(EMAIL_EXISTED);
    }
    if (!user) {
      return { username: username, password: password };
    }
  }
}
