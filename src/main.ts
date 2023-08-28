import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import cluster from 'cluster';
import * as os from 'os';
import compression from 'compression';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
const cpus = os.cpus();

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') initializeSystem();
  else {
    if (cluster.isPrimary) {
      for (const cpuCore of cpus) {
        console.log(`Forking a process`, cpuCore);
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        cluster.fork();
        console.log(`worker ${worker.process.pid} died`);
      });
    } else initializeSystem();
  }
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
  const prismaService = app.get(PrismaService);
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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.enableShutdownHooks();
  await app.listen(process.env.PORT);
}
bootstrap();
