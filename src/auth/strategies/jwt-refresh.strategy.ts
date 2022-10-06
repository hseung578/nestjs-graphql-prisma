import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

import { JwtPayload } from '../interfaces';
import { JwtConfigService } from '@config/jwt';
import { RedisService } from '@providers/cache/redis/redis.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.refreshKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const refreshToken = req.cookies.refresh;

    const isLogout = await this.redisService.get(`refresh:${refreshToken}`);

    if (isLogout) throw new UnauthorizedException();

    return payload;
  }
}
