import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtPayload } from '../interfaces';
import { JwtConfigService } from '@config/jwt';
import { RedisService } from '@providers/cache/redis/redis.service';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly redisSerivce: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.accessKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    const isLogout = await this.redisSerivce.get(`access:${accessToken}`);

    if (isLogout) throw new UnauthorizedException();

    return payload;
  }
}
