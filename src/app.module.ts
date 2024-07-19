import { EmpResolver } from './graphql/resolver/employee.resolver';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { stringTrimDirective } from './graphql/common/directives/stringTrim.directive';
import { IErrorMsg } from './model/viewModel/generalModel';
import { ViewDropListResolver } from './graphql/resolver/viewDropList.resolver';
import { ConfigModule } from '@nestjs/config';
import { DashBoardStatistics } from './graphql/resolver/viewTable.resolver';
import { EmployeeService } from './services/employee.services';
import { DashBoardService } from './services/dashboard.services';
import EventEmitter from 'events';
import { KetsuResolver } from './graphql/resolver/ketsu.resolver';
import { KetsuBoardService } from '@services/ketsuboard.services';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { RedisModule } from '@nestjs-modules/ioredis';
import Keyv from 'keyv';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailConfig, EmailSender } from '@services/mailconfig.services';
import { HealthModule } from './modules/health.module';
EventEmitter.defaultMaxListeners = 0;

const errorCodeReplace = (err: IErrorMsg): string => {
  if (err.message.includes('database connection'))
    return 'Connection DB Error!';
  else if (err.message.includes('Query.EmployeeBoardAll'))
    return 'Cached data not found!';
  else return 'SERVER_ERROR';
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env\\${process.env.NODE_ENV}.env`,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_SERVER,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [
        process.env.NODE_ENV !== 'production'
          ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
          : ApolloServerPluginLandingPageDisabled(),
      ],
      autoSchemaFile: true,
      transformSchema: (schema) => stringTrimDirective(schema, 'trimString'),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      cache: new KeyvAdapter(new Keyv(process.env.REDIS_SERVER)),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      installSubscriptionHandlers: true,
      formatError: (error: any) => {
        const graphQLFormattedError: IErrorMsg = {
          error: errorCodeReplace(error),
          statusCode:
            error.extensions?.response?.statusCode ?? error.extensions?.code,
          message:
            error.extensions?.originalError?.message ||
            error.extensions?.response?.message ||
            error.message ||
            error.name,
        };
        return graphQLFormattedError;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'downloads'),
      serveRoot: '/downloads',
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    EmpResolver,
    EmployeeService,
    DashBoardService,
    ViewDropListResolver,
    KetsuBoardService,
    KetsuResolver,
    DashBoardStatistics,
    EmailConfig,
    EmailSender,
  ],
})
export class AppModule {}
