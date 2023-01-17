import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { EmployeeBoard } from '../schema-model/viewEmployee.model';
import { IViewEmployeeBoard } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { EmployeeBoardArgs } from '../args/common-args';
@Resolver(() => EmployeeBoard)
export class EmpResolver {
  
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
 
  @Query(returns => [EmployeeBoard])
  async EmployeeBoardAll(@Args() args: EmployeeBoardArgs): Promise<IViewEmployeeBoard[]> {
    const cacheData: IViewEmployeeBoard[] =  await this.cacheManager.get('employeeAllView');

    return cacheData.filter(i => i.areaID = args.areaID)
  }
}
