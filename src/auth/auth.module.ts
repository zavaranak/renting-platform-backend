import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { TenantModule } from 'src/tenant/tenant.module';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { LandlordModule } from 'src/landlord/landlord.module';

@Module({
  imports: [
    TenantModule,
    LandlordModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (serviceConfig: ConfigService) => ({
        signOptions: { expiresIn: '1d' },
        secret: serviceConfig.get<string>('JWT_KEY'),
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, AuthResolver, JwtStrategy],
})
export class AuthModule {}
