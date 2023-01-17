import { EmpResolver } from './graphql/resolver/employee.resolver';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { DirectiveLocation, GraphQLDirective, GraphQLError } from 'graphql';
import { upperDirectiveTransformer } from './graphql/common/directives/upper-case.directive';
import { IErrorMsg } from './model/viewModel/generalModel';
import { EmployeeBoardViewLoop } from './interval-data/employeeboard-interval';

const errorCodeReplace = (err: IErrorMsg): string => {
  if (err.message.includes('database connection'))
    return 'Connection DB Error!';
  else if (err.message.includes(' Query.EmployeeBoardAll'))
    return 'Cached data not found!';
  else return err.message;
};

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: IErrorMsg = {
          message: errorCodeReplace(error),
          code: error.extensions?.code || 'SERVER_ERROR',
          name: error.extensions?.exception?.code || error.name,
        };
        return graphQLFormattedError;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EmpResolver, EmployeeBoardViewLoop],
})
export class AppModule {}
