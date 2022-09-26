import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('database.url');
  }
}
