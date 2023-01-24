import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
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

  @Query((returns) => [EmployeeBoard])
  async EmployeeBoardAll(
    @Args() args: EmployeeBoardArgs,
  ): Promise<IViewEmployeeBoard[] | []> {
    const cacheData: IPayloadEmployeeBoard = await this.cache.get(
      'employeeAllView',
    );
    return payloadFilter(cacheData, args);
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
  return EmployeeBoardAllSub || [];
}
