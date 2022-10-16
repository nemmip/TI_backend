import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LocalAuthGuard } from 'src/commons/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthLoginInput } from './models/auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => String)
  async createLoginSession(@Args('input') input: AuthLoginInput) {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    return await this.authService.login(user);
  }
}
