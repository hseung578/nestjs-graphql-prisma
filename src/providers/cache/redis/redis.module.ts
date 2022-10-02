import { CacheModule, CacheModuleAsyncOptions, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { RedisConfigModule, RedisConfigService } from '@config/cache/redis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      imports: [RedisConfigModule],
      useFactory: (redisConfig: RedisConfigService) => ({
        store: redisStore,
        host: redisConfig.host,
        port: redisConfig.port,
        isGlobal: true,
      }),
      inject: [RedisConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
