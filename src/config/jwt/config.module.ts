import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { JwtConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        ACCESS_KEY: Joi.string().default('access'),
        ACCESS_EXPIRE: Joi.string().default('1h'),
        REFRESH_KEY: Joi.string().default('refresh'),
        REFRESH_EXPIRE: Joi.string().default('1w'),
      }),
    }),
  ],
  providers: [ConfigService, JwtConfigService],
  exports: [ConfigService, JwtConfigService],
})
export class JwtConfigModule {}
