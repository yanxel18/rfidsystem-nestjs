import { Args, Context, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { EmployeeBoard } from '../schema-model/viewEmployee.model';
import {
  IEmployeeBoardArgs,
  IPayloadEmployeeBoard,
  IViewEmployeeBoard,
} from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { EmployeeBoardArgs } from '../args/common-args';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => EmployeeBoard)
export class EmpResolver {
  pubSub = new PubSub();
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {
    setInterval(async () => {
      const cacheData: IPayloadEmployeeBoard[] = await this.cache.get(
        'employeeAllView',
      );
      let returnCachedData: IPayloadEmployeeBoard[] = cacheData;
      this.pubSub.publish('employeeAllViewx', returnCachedData);
    }, 1000);
  }

  @Query((returns) => Int, { nullable: true })
  async EmpCount(): Promise<Number | null> {
    const cacheData: IPayloadEmployeeBoard = await this.cache.get(
      'employeeAllView',
    ); 
    return Object.keys(cacheData.EmployeeBoardAllSub).length;
  }

  @Query((returns) => Int)
  async EmpBoardMaxCountFilter(
    @Args() args: EmployeeBoardArgs,
  ): Promise<Number | null> { 
    const cacheData : IPayloadEmployeeBoard=  await this.cache.get(
      'employeeAllView',
    );  
    return cacheData ? (payloadFilter(cacheData,args)).length : 0;
  } 
  @Query((returns) => [EmployeeBoard])
  async EmployeeBoardAll(
    @Args() args: EmployeeBoardArgs,
  ): Promise<IViewEmployeeBoard[] | []> {
    // const cacheData: IPayloadEmployeeBoard = await this.cache.get(
    //   'employeeAllView',
    // );
    // return payloadFilter(cacheData, args);
    return [];
  }

  @Subscription((returns) => [EmployeeBoard], {
    resolve: (
      payload: IPayloadEmployeeBoard,
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
}
function payloadFilter(
  payload: IPayloadEmployeeBoard,
  variables: IEmployeeBoardArgs,
): IViewEmployeeBoard[] | [] {
  let EmployeeBoardAllSub = payload.EmployeeBoardAllSub;
  if (variables.areaID)
    EmployeeBoardAllSub = EmployeeBoardAllSub.filter(
      (i) => i.areaID === variables.areaID,
    );
  if (variables.locID)
    EmployeeBoardAllSub = EmployeeBoardAllSub.filter(
      (i) => i.locID === variables.locID,
    );
  if (variables.teamID)
    EmployeeBoardAllSub = EmployeeBoardAllSub.filter(
      (i) => i.teamID === variables.teamID,
    );
  if (variables.pageoffset) {
    const pagenumber: number =
      variables.pagenum === 1
        ? 0
        : variables.pagenum * variables.pageoffset - variables.pageoffset;
    const pageoffset: number =
      variables.pagenum === 1
        ? variables.pageoffset
        : variables.pagenum * variables.pageoffset;
    EmployeeBoardAllSub = EmployeeBoardAllSub.slice(pagenumber, pageoffset);
  }
  return EmployeeBoardAllSub;
}
 