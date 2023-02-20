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
    setInterval(async () => {
      const cacheData: IPayloadEmployeeBoardWithRatio = await this.cache.get(
        'employeeAllView',
      );
      this.pubSub.publish('employeeAllViewx', cacheData);
    }, 1000);
  }   


  @Query((returns) => Int)
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

  @Query((returns) => EmployeeBoardAllSub)
  async EmployeeBoardAll(
    @Args() args: EmployeeBoardArgs,
  ): Promise<IPayloadEmployeeBoardWithRatio | []> {
    const cacheData: IPayloadEmployeeBoardWithRatio = await this.cache.get(
      'employeeAllView',
    ); 
    return [];
  } 

  @Subscription((returns) => EmployeeBoardAllSub, {
    resolve: (
      payload: IPayloadEmployeeBoardWithRatio,
      variables: IEmployeeBoardArgs,
    ) => {
      return payloadFilter(payload, variables);
    },
  })
  async EmployeeBoardAllSub(
    @Args() args: EmployeeBoardArgs,
    @Context('pubsub') pubSub: PubSub,
  ) {
    return this.pubSub.asyncIterator('employeeAllViewx');
  }  

  @Mutation((returns) => EmployeeCommentResponse)
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

function payloadFilter(
  payload: IPayloadEmployeeBoardWithRatio,
  variables: IEmployeeBoardArgs,
): IPayloadEmployeeBoardWithRatio {
  let newPayload = payload.EmployeeBoardAllSub;
  let currentWorkerCount = 0;
  let totalWorkerCount = 0;
  let currentPercent: string = '0/0';
  if (variables.areaID)
    newPayload = newPayload.filter((i) => i.empArea === variables.areaID);
  if (variables.locID)
    newPayload = newPayload.filter((i) => i.empLoc === variables.locID);
  if (variables.teamID)
    newPayload = newPayload.filter((i) => i.teamID === variables.teamID);

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
