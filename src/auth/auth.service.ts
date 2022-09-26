import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@config/jwt';
import { AccessToken } from './interfaces';
import { Response } from 'express';
import { User } from '@modules/user/users/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  getAccessToken(user: Pick<User, 'id' | 'email'>): AccessToken {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access: this.jwtService.signAsync(payload, {
        secret: this.jwtConfigService.accessKey,
        expiresIn: this.jwtConfigService.accessExpire,
      }),
    };
  }

  setRefreshToken(user: Pick<User, 'id' | 'email'>, res: Response): void {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.refreshKey,
      expiresIn: this.jwtConfigService.refreshExpire,
    });

    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }
}
