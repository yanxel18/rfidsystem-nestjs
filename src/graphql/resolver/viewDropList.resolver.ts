import { Query, Resolver } from '@nestjs/graphql';
import { IViewDropList } from 'src/model/viewModel/viewTableModel';
import { AppService } from 'src/app.service';
import { OViewDropList } from '../schema-model/viewDropList.model';

@Resolver(() => OViewDropList)
export class ViewDropListResolver {
  constructor(private readonly appService: AppService) {}
  @Query((returns) => OViewDropList, { nullable: true })
  async ViewDropList(): Promise<IViewDropList | null> {
    const responseQuery: IViewDropList = JSON.parse(
      (await this.appService.getViewDropList())[0].ViewDropList,
    )[0];
    return responseQuery;
  }
}
