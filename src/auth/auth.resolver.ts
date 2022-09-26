import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '@modules/user/users/users.service';
import { User } from '@modules/user/users/models';
import { LoginInput, SignUpInput } from './dtos';
import { AccessToken } from './interfaces';
import { JwtToken } from './models';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UsersService,
  ) {}

  @Mutation(() => User)
  async signup(@Args('input') { email, password }: SignUpInput): Promise<User> {
    const user = await this.userSerivce.findOne(email);
    if (user) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userSerivce.create({ email, password: hashedPassword });
  }

  @Mutation(() => JwtToken)
  async login(
    @Args('input') { email, password }: LoginInput,
    @Context() context: any,
  ): Promise<AccessToken> {
    const user = await this.userSerivce.findOne(email);
    if (!user) {
      throw new NotFoundException();
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnauthorizedException();
    }

    this.authService.setRefreshToken(user, context.req.res);

    return this.authService.getAccessToken(user);
  }
}
