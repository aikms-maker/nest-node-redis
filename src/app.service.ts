import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  createClient,
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private redisClient: RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  >;

  constructor() {
    const redisClientOptions: RedisClientOptions = {
      url: 'redis://127.0.0.1:6379',
      database: 1,
      disableOfflineQueue: true,
    };

    this.redisClient = createClient(redisClientOptions);

    this.redisClient.on('connect', () => console.log(`connect Redis`));
    this.redisClient.on('ready', () => console.log(`ready Redis`));
    this.redisClient.on('end', () => console.log(`end Redis`));
    this.redisClient.on('error', (error) => {
      console.error(`error Redis`);
      console.error(error);
    });
    this.redisClient.on('reconnecting', () =>
      console.log(`reconnecting Redis`),
    );
  }

  async connect(): Promise<void> {
    await this.redisClient.connect();
  }

  async onApplicationShutdown(_signal: string): Promise<void> {
    try {
      await this.redisClient.quit();
    } catch (error) {
      console.error('Redisとの切断に失敗しました。');
      console.error(error);
    }
  }

  async getHello(): Promise<string> {
    await this.redisClient.set('testKey', 'testValue');
    const getValue = await this.redisClient.get('testKey');
    return getValue;
  }
}
