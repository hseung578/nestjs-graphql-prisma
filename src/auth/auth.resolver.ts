import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '@modules/user/users/users.service';
import { User } from '@modules/user/users/models';
import { LoginInput, SignUpInput } from './dtos';
import { JwtPayload } from './interfaces';
import { AccessToken } from './models';
import { JwtAccessGuard, JwtRefreshGuard } from './guards';
import { CurrentUser } from './decorators';
import { RedisService } from '@providers/cache/redis/redis.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UsersService,
    private readonly redisService: RedisService,
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

  @Mutation(() => AccessToken)
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

    await this.authService.setRefreshToken(user, context.req.res);

    return this.authService.getAccessToken(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Mutation(() => AccessToken)
  recoverAccessToken(@CurrentUser() { sub: id, email }: JwtPayload) {
    return this.authService.getAccessToken({ id, email });
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers.cookie.replace('refresh=', '');

    const verifiedToken = await this.authService.verify(
      accessToken,
      refreshToken,
    );

    await this.redisService.set<string>(`access:${accessToken}`, 'black', {
      ttl: verifiedToken.access['exp'] - verifiedToken.access['iat'],
    });
    await this.redisService.set<string>(`refresh:${refreshToken}`, 'black', {
      ttl: verifiedToken.refresh['exp'] - verifiedToken.refresh['iat'],
    });

    return true;
  }
}
