import { CacheModule, CacheModuleAsyncOptions, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { RedisConfigModule, RedisConfigService } from '@config/cache/redis';

@Module({
  imports: [
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      imports: [RedisConfigModule],
      useFactory: (redisConfig: RedisConfigService) => ({
        store: redisStore,
        host: redisConfig.host,
        port: redisConfig.port,
      }),
      inject: [RedisConfigService],
    }),
  ],
})
export class RedisModule {}
