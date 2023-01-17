import { CacheModule, Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { RedisEnum } from './errcode/errorcode';

@Global()
@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: RedisEnum.REDIS_CACHE,
      useFactory: async () =>
        await redisStore({
          socket: {
            host: '127.0.0.1',
            port: 6379,
          },
          ttl: 10,
        }),
    },
  ],
  exports: [RedisEnum.REDIS_CACHE],
})
export class RedisCacheModule {}
