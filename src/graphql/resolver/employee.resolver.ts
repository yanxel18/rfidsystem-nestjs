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
  IViewEmployeeBoard,
} from 'src/model/viewModel/viewTableModel';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { CommentArgs, EmployeeBoardArgs } from '../args/employee.args';
import { PubSub } from 'graphql-subscriptions';
import { EmployeeService } from 'src/services/employee.services';

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
      ? payloadFilter(cacheData, args).EmployeeBoardAllSub.length
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
      return payloadFilter(payload, variables);
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
/**
 *
 * @param payload
 * @param variables
 * @returns  the new subscription payload used fro subscription directive @Subscription for
 * EmployeeBoardAllSub.
 */
function payloadFilter(
  payload: IPayloadEmployeeBoardWithRatio,
  args: IEmployeeBoardArgs,
): IPayloadEmployeeBoardWithRatio {
  const excludeStatusID: number[] = [3, 4];
  let newPayload = payload.EmployeeBoardAllSub;
  let currentWorkerCount = 0;
  let totalWorkerCount = 0;
  let currentPercent = '0/0';
  newPayload = clientFilter(newPayload, args);
  currentWorkerCount = newPayload.filter(
    (x) => x.statusID === 1 && !excludeStatusID.some((ex) => x.statusID === ex),
  ).length;
  totalWorkerCount = newPayload.filter(
    (x) => !excludeStatusID.some((ex) => x.statusID === ex),
  ).length;
  currentPercent = `${
    totalWorkerCount !== 0
      ? Math.round((currentWorkerCount / totalWorkerCount) * 100).toString()
      : 0
  }%`;
  if (typeof args.pageoffset === 'number') {
    const pagenumber: number =
      args.pagenum === 1 ? 0 : args.pagenum * args.pageoffset - args.pageoffset;
    const pageoffset: number =
      args.pagenum === 1 ? args.pageoffset : args.pagenum * args.pageoffset;
    newPayload = newPayload.slice(pagenumber, pageoffset);
  }
  payload = {
    EmployeeBoardAllSub: newPayload,
    AreaRatio: {
      currentWorkerCount,
      totalWorkerCount,
      currentPercent,
    },
  };
  return payload;
}

function clientFilter(
  newPayload: IViewEmployeeBoard[],
  args: IEmployeeBoardArgs,
): IViewEmployeeBoard[] {
  if (typeof args.search === 'string')
    newPayload = newPayload.filter((i) =>
      i.displayName.includes(args.search.trim()),
    );
  else {
    if (typeof args.areaID === 'number')
      newPayload = newPayload.filter((i) => i.empArea === args.areaID);
    if (typeof args.locID === 'number')
      newPayload = newPayload.filter((i) => i.empLoc === args.locID);
    if (typeof args.teamID === 'number')
      newPayload = newPayload.filter((i) => i.teamID === args.teamID);
    if (typeof args.posID === 'number')
      newPayload = newPayload.filter((i) => i.posID === args.posID);
    if (typeof args.divID === 'number')
      newPayload = newPayload.filter((i) => i.divID === args.divID);
    if (typeof args.order === 'number') {
      switch (args.order) {
        case 1: {
          newPayload = newPayload.sort((a, b) => {
            return (
              a.statusOrder - b.statusOrder ||
              a.displayName.localeCompare(b.displayName)
            );
          });
          break;
        }
        case 2: {
          newPayload = newPayload.sort((a, b) => {
            return (
              b.statusOrder - a.statusOrder ||
              a.displayName.localeCompare(b.displayName)
            );
          });
          break;
        }
      }
    }
  }
  return newPayload;
}
