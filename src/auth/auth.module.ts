import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { TenantModule } from 'src/tenant/tenant.module';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TenantModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (serviceConfig: ConfigService) => ({
        signOptions: { expiresIn: '120s' },
        secret: serviceConfig.get<string>('JWT_KEY'),
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, AuthResolver, JwtStrategy],
})
export class AuthModule {}
