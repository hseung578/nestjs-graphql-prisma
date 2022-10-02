import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@config/jwt';
import { JwtToken } from './interfaces';
import { Response } from 'express';
import { User } from '@modules/user/users/models';
import { AccessToken } from './models';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  async getAccessToken(user: Pick<User, 'id' | 'email'>): Promise<AccessToken> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.accessKey,
      expiresIn: this.jwtConfigService.accessExpire,
    });

    return {
      access: accessToken,
    };
  }

  async setRefreshToken(
    user: Pick<User, 'id' | 'email'>,
    res: Response,
  ): Promise<void> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.refreshKey,
      expiresIn: this.jwtConfigService.refreshExpire,
    });

    res.cookie('refresh', refreshToken, { path: '/' });
  }

  async verify(accessToken: string, refreshToken: string): Promise<JwtToken> {
    try {
      const verifiedAccessToken = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: this.jwtConfigService.accessKey,
        },
      );
      const verifiedRefreshToken = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.jwtConfigService.refreshKey,
        },
      );

      return { access: verifiedAccessToken, refresh: verifiedRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
