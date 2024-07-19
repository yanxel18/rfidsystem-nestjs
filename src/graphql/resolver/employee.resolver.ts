import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {
  EmployeeBoardAllSub,
  StatusResponse,
} from '@schemaModels/viewEmployee.model';
import {
  IEmployeeBoardArgs,
  IPayloadEmployeeBoardWithRatio,
  IStatusResponse,
} from '@viewModels/viewTableModel';
import { OnModuleInit } from '@nestjs/common';
import { CommentArgs, EmployeeBoardArgs } from '../args/employee.args';
import { PubSub } from 'graphql-subscriptions';
import { EmployeeService } from '@services/employee.services';
import { PayloadFilter } from '@services/filterpayload';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Resolver(() => EmployeeBoardAllSub)
export class EmpResolver implements OnModuleInit {
  pubSub = new PubSub();
  constructor(
    private readonly employeeService: EmployeeService,
    @InjectRedis() private redis: Redis,
  ) {}
  /**
   * this interval per 1 second queries on the cache memory to be broadcast on 'employeeAllViewx'
   * topic to be received by subscribing clients.
   * If the client subscribes to EmployeeBoardAllSub subscription, this is the data that will be published.
   * Publish data every 1000ms or 1 second is recommended.
   */
  async onModuleInit(): Promise<void> {
    setInterval(() => {
      this.initializeEmployeeData();
    }, 1000);
  }

  initializeEmployeeData(): void {
    this.redis.get('employeeAllView').then((data) => {
      this.pubSub.publish('employeeAllViewx', JSON.parse(data));
    });
  }
  /**
   *
   * @param args
   * @returns The total number of employee count to be displayed on the Board.
   * This also used on the paginator total number of workers.
   */
  @Query((_returns) => Int, { nullable: true })
  async EmpBoardMaxCountFilter(
    @Args() args: EmployeeBoardArgs,
  ): Promise<number> {
    const cacheData: IPayloadEmployeeBoardWithRatio = JSON.parse(
      await this.redis.get('employeeAllView'),
    );
    return cacheData
      ? PayloadFilter.payloadFilter(cacheData, args).EmployeeBoardAllSub.length
      : 0;
  }
  /**
   *
   * @param _args
   * @returns the all employee list but returns zero length array.
   * The blank query return is necessary for the subscription template.
   */
  @Query((_returns) => EmployeeBoardAllSub)
  async EmployeeBoardAll(
    @Args() _args: EmployeeBoardArgs,
  ): Promise<IPayloadEmployeeBoardWithRatio | []> {
    return [];
  }
  /**
   *
   * @param _args
   * areaID, teamID, locID, posID, pageoffset,pagenum
   * @param _pubSub
   * @returns employee list on subscription method. This is a live streaming of data
   * and subscribed by the client. The resolve is used for modification of payloads upon
   * filter. The resolve changes the subscription payload data for each client depends on the received argument.
   */
  @Subscription((_returns) => EmployeeBoardAllSub, {
    resolve: (
      payload: IPayloadEmployeeBoardWithRatio,
      variables: IEmployeeBoardArgs,
    ) => {
      return PayloadFilter.payloadFilter(payload, variables);
    },
  })
  async EmployeeBoardAllSub(
    @Args() _args: EmployeeBoardArgs,
    @Context('pubsub') _pubSub: PubSub,
  ) {
    return this.pubSub.asyncIterator('employeeAllViewx');
  }
  /**
   *
   * @param args
   * @returns nothing
   * This mutation inserts or update a comment section on the board per worker id.
   */
  @Mutation((_returns) => StatusResponse, { nullable: true })
  async UpdateEmployeeComment(
    @Args() args: CommentArgs,
  ): Promise<IStatusResponse> {
    return await this.employeeService.updateEmployeeComment(args);
  }
}
