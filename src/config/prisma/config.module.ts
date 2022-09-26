import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { PrismaConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().default('localhost'),
      }),
    }),
  ],
  providers: [ConfigService, PrismaConfigService],
  exports: [ConfigService, PrismaConfigService],
})
export class PrismaConfigModule {}
