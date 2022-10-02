import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T = unknown>(key: string): Promise<T> {
    return await this.cacheManager.get<T>(key);
  }

  async set<T = unknown>(
    key: string,
    value: any,
    options?: CachingConfig,
  ): Promise<void> {
    await this.cacheManager.set<T>(key, value, options);
  }
}
