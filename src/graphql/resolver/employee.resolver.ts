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
import { AppService } from 'src/app.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { CommentArgs, EmployeeBoardArgs } from '../args/common-args';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => EmployeeBoardAllSub)
export class EmpResolver {
  pubSub = new PubSub();
  constructor(
    private readonly appService: AppService,
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
  @Query((_returns) => Int)
  async EmpBoardMaxCountFilter(
    @Args() args: EmployeeBoardArgs,
  ): Promise<Number | null> {
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
    const cacheData: IPayloadEmployeeBoardWithRatio = await this.cache.get(
      'employeeAllView',
    ); 
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
  @Mutation((_returns) => EmployeeCommentResponse)
  async UpdateEmployeeComment(
    @Args() args: CommentArgs,
  ): Promise<IReponseComment> {
    if (args.comment)
    args = { 
      ...args,
      comment: args.comment.trim(),
    };
    const exec = await this.appService.updateEmployeeComment(args);
    return {
      status: exec.toString(),
    };
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
  variables: IEmployeeBoardArgs,
): IPayloadEmployeeBoardWithRatio {
  let newPayload = payload.EmployeeBoardAllSub;
  let currentWorkerCount: number = 0;
  let totalWorkerCount: number = 0;
  let currentPercent: string = '0/0';
  if (variables.areaID)
    newPayload = newPayload.filter((i) => i.empArea === variables.areaID);
  if (variables.locID)
    newPayload = newPayload.filter((i) => i.empLoc === variables.locID);
  if (variables.teamID)
    newPayload = newPayload.filter((i) => i.teamID === variables.teamID);
  if (variables.posID)
    newPayload = newPayload.filter((i) => i.posID === variables.posID);

  currentWorkerCount = newPayload.filter((x) => x.statusID === 1).length;
  totalWorkerCount = newPayload.length;
  currentPercent = `${
    totalWorkerCount !== 0
      ? Math.round((currentWorkerCount / totalWorkerCount) * 100).toString()
      : 0 }%`;
  if (variables.pageoffset) {
    //EmployeeBoardAllSub = EmployeeBoardAllSub.sort((a, b) =>  a.displayName.localeCompare(b.displayName))
    const pagenumber: number =
      variables.pagenum === 1
        ? 0
        : variables.pagenum * variables.pageoffset - variables.pageoffset;
    const pageoffset: number =
      variables.pagenum === 1
        ? variables.pageoffset
        : variables.pagenum * variables.pageoffset;
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