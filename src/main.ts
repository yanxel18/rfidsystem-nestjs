import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  initializeSystem();
}

async function initializeSystem() {
  const app: INestApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: true,
      abortOnError: false,
    });

  const appConfig = app.getHttpAdapter().getInstance();
  appConfig.disable('x-powered-by', 'X-Powered-By');
  appConfig.set('etag', false);
  appConfig.set('json spaces', 2);
  app.use(compression());
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(
      helmet.hsts({
        maxAge: 15552000,
        includeSubDomains: true,
      }),
    );
  }

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen(process.env.PORT);
}
bootstrap();
