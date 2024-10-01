import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TenantInput } from './dto/tenant-auth-input';
import { LogInResponseTenant } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './graphql.auth-guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LogInResponseTenant)
  @UseGuards(LocalAuthGuard)
  async tenantLogIn(
    @Args('tenantInput') tenantInput: TenantInput,
    @Context() context,
  ) {
    return this.authService.tenantLogIn(context.user);
  }

  @Mutation(() => LogInResponseTenant)
  @UseGuards(LocalAuthGuard)
  async tenantSignUp(
    @Args('tenantInput') tenantInput: TenantInput,
    @Context() context,
  ) {
    return this.authService.tenantSignUp(
      context.user.username,
      context.user.password,
    );
  }
}
