import { DashBoardService } from './../../services/dashboard.services';
import { Query, Resolver } from '@nestjs/graphql';
import { IViewDropList } from 'src/model/viewModel/viewTableModel'; 
import { OViewDropList } from '../schema-model/viewDropList.model';

@Resolver(() => OViewDropList)
export class ViewDropListResolver {
  constructor(private readonly dashboardService: DashBoardService) {}
/**
 * 
 * @returns list dropdownlist data for viewboard client.
 * IArealist, ILocationList, ITeamList and IPositionList.
 */
  @Query((returns) => OViewDropList, { nullable: true })
  async ViewDropList(): Promise<IViewDropList | null> { 
    return JSON.parse(
      (await this.dashboardService.getViewDropList())[0].ViewDropList,
    )[0];
  }
  
}
