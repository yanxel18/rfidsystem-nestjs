import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { EmployeeBoard } from '../schema-model/viewEmployee.model';
import { IViewEmployeeBoard } from 'src/model/viewModel/viewTableModel';
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
      const cacheData: IViewEmployeeBoard[] = await this.cache.get(
        'employeeAllView',
      );
      let returnCachedData: IViewEmployeeBoard[] = cacheData;  
       this.pubSub.publish('employeeAllViewx', { EmployeeBoardAllSub:  returnCachedData});
    }, 1000);
  }

  @Query((returns) => [EmployeeBoard])
  async EmployeeBoardAll(
    @Args() args: EmployeeBoardArgs,
  ): Promise<IViewEmployeeBoard[] | []> {
    const cacheData: IViewEmployeeBoard[] = await this.cache.get(
      'employeeAllView',
    );
    let returnCachedData: IViewEmployeeBoard[] = cacheData;

    if (args.areaID)
      returnCachedData = returnCachedData.filter(
        (i) => i.areaID === args.areaID,
      );
    if (args.locID)
      returnCachedData = returnCachedData.filter((i) => i.locID === args.locID);
    if (args.teamID)
      returnCachedData = returnCachedData.filter(
        (i) => i.teamID === args.teamID,
      );
    return returnCachedData;
  } 
  @Subscription((returns) => [EmployeeBoard], {
    filter: (payload, variables) =>   { 
      return payload.areaID === variables.areaID
    }
  },)
  async EmployeeBoardAllSub(payload)  {  
    return this.pubSub.asyncIterator('employeeAllViewx') ;
  }
}
 