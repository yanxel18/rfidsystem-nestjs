import { EmployeeBoard } from 'src/graphql/schema-model/viewEmployee.model';
import { IPayloadEmployeeBoard, IViewEmployeeBoard } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
@Injectable()
export class EmployeeBoardViewLoop {
  pubSub = new PubSub();
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  async EmployeeBoardAll(): Promise<void> {
    let employeeAllView: IViewEmployeeBoard[];
    setInterval(async () => {
      employeeAllView = await this.appService.employee_list();
      const returndata : IPayloadEmployeeBoard = {
        EmployeeBoardAllSub: employeeAllView
      } 
      this.cache.set('employeeAllView', returndata, 5000); 
      // this.pubSub.publish('employeeAllViewx', { returndata});
    }, 1000);
  }
}  