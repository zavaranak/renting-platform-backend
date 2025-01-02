import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Roles, UserInput } from './dto/auth_input';
import { AuthResponse } from './dto/login_response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './graphql.auth-guard';
import { LandlordService } from 'src/landlord/landlord.service';
import { TenantService } from 'src/tenant/tenant.service';
import { QueryParams } from 'src/common/query_function';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly landlordService: LandlordService,
    private readonly tenantService: TenantService,
  ) {}

  @Mutation(() => AuthResponse)
  @UseGuards(LocalAuthGuard)
  async logIn(
    @Args('userInput') userInput: UserInput,
    @Context() context: any,
  ) {
    if (userInput.role === Roles.TENANT) {
      return this.authService.tenantLogIn(context.user);
    }
    if (userInput.role === Roles.LANDLORD) {
      return this.authService.landlordLogIn(context.user);
    }
  }

  @Mutation(() => AuthResponse)
  @UseGuards(LocalAuthGuard)
  async signUp(
    @Args('userInput') userInput: UserInput,
    @Context() context: any,
  ) {
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

  @Query(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async verifyUser(@Context() context: any) {
    if (!context.req.user)
      return {
        message: 'user not found',
      };
    const { id, role } = context.req.user;
    if (!id)
      return {
        message: 'user not found',
      };
    if (!role)
      return {
        message: 'user not found',
      };
    const queryParams: QueryParams = {
      queryValue: id,
      queryType: 'id',
      relations: ['attributes'],
    };
    if (role === Roles.TENANT) {
      const tenant = await this.tenantService.getOne(queryParams);
      return {
        message: 'authorized',
        tenant: tenant,
      };
    } else if (role === Roles.LANDLORD) {
      const landlord = await this.landlordService.getOne(queryParams);
      return {
        message: 'authorized',
        landlord: landlord,
      };
    }
  }
}
