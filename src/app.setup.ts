import { INestApplication } from '@nestjs/common';
import { AppService } from './app.service';

export const setup = async (app: INestApplication) => {
  const appService = app.get(AppService);
  await appService.connect();

  app.enableShutdownHooks();
};
