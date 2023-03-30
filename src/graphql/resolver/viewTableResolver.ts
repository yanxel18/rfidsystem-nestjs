import { Args, Query, Resolver } from '@nestjs/graphql';
import { IPerAreaStatistics, ITotalAreaStatistics } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { OPerAreaStatistics, OTotalStatistics } from '../schema-model/viewTableModel';
import { AreaStatisticArgs, TotalStatisticArgs } from '../args/common-args';

@Resolver(() => OPerAreaStatistics)
export class DashBoardStatistics {
  constructor(private readonly appService: AppService) {}

  @Query((returns) => [OPerAreaStatistics])
  async PerAreaStatistic(@Args() args: AreaStatisticArgs): Promise<IPerAreaStatistics[]> {
    const responseQuery: IPerAreaStatistics[] = await this.appService.getPerAreaStatistics(args.AreaSelectedDate);
    return responseQuery;
  }
  

  @Query((returns) => [OTotalStatistics])
  async TotalAreaStatistic(@Args() args: TotalStatisticArgs): Promise<ITotalAreaStatistics[]> {
    const responseQuery: ITotalAreaStatistics[] = await this.appService.getTotalAreaStatistics(args.TotalStatSelectedDate);
    return responseQuery;
  }

}
 