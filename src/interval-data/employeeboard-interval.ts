import { IPayloadEmployeeBoardWithRatio } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
@Injectable()
export class EmployeeBoardViewLoop {
  pubSub = new PubSub();
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {} 
  async EmployeeBoardAll(): Promise<void> { 
    /**
     * this interval queries in the database every 1second to the view_employee_board
     * and store it in the cache memory with retention period of 5 seconds.
     */
    setInterval(async () => { 
      const returndata : IPayloadEmployeeBoardWithRatio = {  
          EmployeeBoardAllSub: await this.appService.employee_list(),
          AreaRatio: null  //do something !! if already query then loop! or delay?!
      }    
      this.cache.set('employeeAllView', returndata, 5000);  
    }, 1000);
  }
} 