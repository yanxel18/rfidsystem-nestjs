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
  EmployeeCommentResponse,
} from '../schema-model/viewEmployee.model';
import {
  IEmployeeBoardArgs,
  IPayloadEmployeeBoardWithRatio,
  IReponseComment,
} from 'src/model/viewModel/viewTableModel';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { CommentArgs, EmployeeBoardArgs } from '../args/employee.args';
import { PubSub } from 'graphql-subscriptions';
import { EmployeeService } from 'src/services/employee.services';
import { PayloadFilter } from 'src/services/filterpayload';

@Resolver(() => EmployeeBoardAllSub)
export class EmpResolver {
  pubSub = new PubSub();
  constructor(
    private readonly employeeService: EmployeeService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {
    /**
     * this interval per 1 second queries on the cache memory to be broadcast on 'employeeAllViewx'
     * topic to be received by subscribing clients.
     * If the client subscribes to EmployeeBoardAllSub subscription, this is the data that will be published.
     */
    setInterval(async () => {
      const cacheData: IPayloadEmployeeBoardWithRatio = await this.cache.get(
        'employeeAllView',
      );
      this.pubSub.publish('employeeAllViewx', cacheData);
    }, 1000);
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
    const cacheData: IPayloadEmployeeBoardWithRatio = await this.cache.get(
      'employeeAllView',
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
  @Mutation((_returns) => EmployeeCommentResponse, { nullable: true })
  async UpdateEmployeeComment(
    @Args() args: CommentArgs,
  ): Promise<IReponseComment> {
    return await this.employeeService.updateEmployeeComment(args);
  }
}
