import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get accessKey(): string {
    return this.configService.get<string>('jwt.accessKey');
  }
  get accessExpire(): string {
    return this.configService.get<string>('jwt.accessExpire');
  }
  get refreshKey(): string {
    return this.configService.get<string>('jwt.refreshKey');
  }
  get refreshExpire(): string {
    return this.configService.get<string>('jwt.refreshExpire');
  }
}
