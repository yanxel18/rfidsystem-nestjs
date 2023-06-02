import { EmpResolver } from './graphql/resolver/employee.resolver';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { stringTrimDirective } from './graphql/common/directives/stringTrim.directive';
import { IErrorMsg } from './model/viewModel/generalModel';
import { ViewDropListResolver } from './graphql/resolver/viewDropList.resolver';
import { ConfigModule } from '@nestjs/config';
import { DashBoardStatistics } from './graphql/resolver/viewTableResolver';
import { EmployeeService } from './services/employee.services';
import { DashBoardService } from './services/dashboard.services';
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
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [ApolloServerPluginLandingPageDisabled()],
      autoSchemaFile: true,
      transformSchema: (schema) => stringTrimDirective(schema, 'trimString'),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      cache: 'bounded',
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      installSubscriptionHandlers: true,
      formatError: (error: any ) => {
        const graphQLFormattedError: IErrorMsg = {
          error: errorCodeReplace(error),
          statusCode:   error.extensions?.response?.statusCode ?? error.extensions?.code ,
          message:   error.extensions?.response?.message || error.message ||error.name 
        };
        return graphQLFormattedError;
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    EmpResolver,
    EmployeeService,
    DashBoardService,
    ViewDropListResolver,
    DashBoardStatistics,
  ],
})
export class AppModule {}
 