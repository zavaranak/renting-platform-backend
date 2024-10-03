import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Roles, UserInput } from './dto/auth_input';
import { AuthResponse } from './dto/login_response';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './graphql.auth-guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @UseGuards(LocalAuthGuard)
  async logIn(@Args('userInput') userInput: UserInput, @Context() context) {
    if (userInput.role === Roles.TENANT) {
      return this.authService.tenantLogIn(context.user);
    }
    if (userInput.role === Roles.LANDLORD) {
      return this.authService.landlordLogIn(context.user);
    }
  }

  @Mutation(() => AuthResponse)
  @UseGuards(LocalAuthGuard)
  async signUp(@Args('userInput') userInput: UserInput, @Context() context) {
    if (userInput.role === Roles.TENANT) {
      return this.authService.tenantSignUp(
        context.user.username,
        context.user.password,
      );
    }
    if (userInput.role === Roles.LANDLORD) {
      return this.authService.landlordSignUp(
        context.user.username,
        context.user.password,
      );
    }
  }
}
