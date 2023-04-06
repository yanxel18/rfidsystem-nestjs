import { Args, Query, Resolver } from '@nestjs/graphql';
import { IPerAreaGraph, IPerAreaStatistics, ITotalAreaStatistics } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { OPerAreaGraph, OPerAreaStatistics, OTotalStatistics } from '../schema-model/viewTableModel';
import { AreaGraphArgs, AreaStatisticArgs, TotalStatisticArgs } from '../args/common-args';

@Resolver(() => OPerAreaStatistics)
export class DashBoardStatistics {
  constructor(private readonly appService: AppService) {}
/**
 * 
 * @param args 
 * @returns 
 */
  @Query((returns) => [OPerAreaStatistics])
  async PerAreaStatistic(@Args() args: AreaStatisticArgs): Promise<IPerAreaStatistics[]> {
    return await this.appService.getPerAreaStatistics(args.areaSelectedDate);
  }
  
/**
 * 
 * @param args 
 * @returns 
 */
  @Query((returns) => [OTotalStatistics])
  async TotalAreaStatistic(@Args() args: TotalStatisticArgs): Promise<ITotalAreaStatistics[]> { 
    return await this.appService.getTotalAreaStatistics(args.totalStatSelectedDate);
  }
/**
 * 
 * @param args 
 * @returns 
 */
  @Query((returns) => [OPerAreaGraph]) 
  async PerAreaGraph(@Args() args: AreaGraphArgs): Promise<IPerAreaGraph[]> { 
    return  await this.appService.getPerAreaGraph(args.areaID, args.locationID,args.teamID);
  }

}
 