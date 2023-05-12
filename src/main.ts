import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import cluster from 'cluster';
import * as os from 'os';
import helmet from 'helmet'; 
const cpus = os.cpus();

async function bootstrap() {
  console.log(cpus.length + " " + cluster.isPrimary);
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
    }else initializeSystem();
  }
}

async function initializeSystem() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: true,
    abortOnError: false,
  });
  const appConfig = app.getHttpAdapter().getInstance();
  appConfig.disable('x-powered-by');
  appConfig.set('etag', false);
  appConfig.set('json spaces', 2);
  const prismaService = app.get(PrismaService); 
  app.use(helmet());
  await prismaService.enableShutdownHooks(app);
  await app.listen(process.env.PORT);
}
bootstrap();