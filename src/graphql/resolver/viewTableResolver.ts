import { Args, Query, Resolver } from '@nestjs/graphql';
import { IDateSelect, IPerAreaGraph, IPerAreaStatistics, ITotalAreaStatistics } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { OPerAreaGraph, OPerAreaStatistics, OTotalStatistics } from '../schema-model/viewTableModel';
import { AreaGraphArgs, AreaStatisticArgs, DateSelectArgs, TotalStatisticArgs } from '../args/common-args';
import { ODateSelect } from '../schema-model/viewDropList.model';

@Resolver(() => OPerAreaStatistics)
export class DashBoardStatistics {
  constructor(private readonly appService: AppService) {}
/**
 * 
 * @param args 
 * @returns data value for each area or　実工程 in the table list on client view.
 * It also used to be displayed on pie grap and main dashboard values.
 */
  @Query((returns) => [OPerAreaStatistics])
  async PerAreaStatistic(@Args() args: AreaStatisticArgs): Promise<IPerAreaStatistics[]> {
    return await this.appService.getPerAreaStatistics(args.areaSelectedDate);
  }
  
/**
 * 
 * @param args 
 * @returns total number of for each dashboard main value.
 * to be displayed to 在室人数、出社人数、在室率
 */
  @Query((returns) => [OTotalStatistics])
  async TotalAreaStatistic(@Args() args: TotalStatisticArgs): Promise<ITotalAreaStatistics[]> { 
    return await this.appService.getTotalAreaStatistics(args.totalStatSelectedDate);
  }
/**
 * 
 * @param args 
 * @returns data set to used by the graph for client side.
 * The data is used for boardview page like graph. The selected area, building and team will be filtered
 * to get the data to ingest to the line graph.
 */
  @Query((returns) => [OPerAreaGraph]) 
  async PerAreaGraph(@Args() args: AreaGraphArgs): Promise<IPerAreaGraph[]> { 
    return  await this.appService.getPerAreaGraph(args.areaID, args.locationID,args.teamID);
  }
/**
 * 
 * @param args 
 * @returns list of available date and time very 30 minutes
 * list from employee_logs_detailed.
 * It means that all date and time from employee_logs_detailed has been group together
 * and created a distinct datelist and pass this to the date and time droplist selection to client side.
 */
  @Query((returns) => [ODateSelect]) 
  async DateSelectList(@Args() args: DateSelectArgs): Promise<IDateSelect[]> { 
    return  await this.appService.getDateSelectList(args.dateFrom);
  }
}
 
