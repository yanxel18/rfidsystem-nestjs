import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  IDateSelect,
  IPerAreaGraph,
  IPerAreaStatistics,
  ITotalAreaStatistics,
} from '@viewModels//viewTableModel';
import {
  OAttendanceTable,
  OAttendanceTotal,
  OPerAreaGraph,
  OPerAreaStatistics,
  OTotalStatistics,
} from '@schemaModels/viewTableModel';
import {
  AreaGraphArgs,
  AreaStatisticArgs,
  DateSelectArgs,
  TotalStatisticArgs,
} from '../args/dashboard.args';
import { ODateSelect } from '@schemaModels/viewDropList.model';
import { DashBoardService } from '@services/dashboard.services';
import {
  IAttendanceTable,
  IAttendanceTotal,
} from 'src/model/validator/attendancevalidator';
import { OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
@Resolver(() => OPerAreaStatistics)
export class DashBoardStatistics implements OnModuleInit {
  constructor(
    private readonly dashboardService: DashBoardService,
    @InjectRedis() private redis: Redis,
  ) {}

  async onModuleInit(): Promise<void> {
    this.initializeAttendanceTableData();
    setInterval(() => {
      this.initializeAttendanceTableData();
    }, 1000 * 50);
  }

  initializeAttendanceTableData(): void {
    this.dashboardService.getAttendanceTable().then((data) => {
      this.redis.set('attendanceTableData', JSON.stringify(data));
    });

    this.dashboardService.getAttendanceTotal().then((data) => {
      this.redis.set('attendanceTableTotalData', JSON.stringify(data));
    });
  }
  /**
   *
   * @param args
   * @returns data value for each area or　実工程 in the table list on client view.
   * It also used to be displayed on pie grap and main dashboard values.
   */
  @Query((returns) => [OPerAreaStatistics], { defaultValue: [] })
  async PerAreaStatistic(
    @Args() args: AreaStatisticArgs,
  ): Promise<IPerAreaStatistics[]> {
    return await this.dashboardService.getPerAreaStatistics(args);
  }

  /**
   *
   * @param args
   * @returns total number of for each dashboard main value.
   * to be displayed to 在室人数、出社人数、在室率
   */
  @Query((returns) => [OTotalStatistics], { defaultValue: [] })
  async TotalAreaStatistic(
    @Args() args: TotalStatisticArgs,
  ): Promise<ITotalAreaStatistics[]> {
    return await this.dashboardService.getTotalAreaStatistics(args);
  }
  /**
   *
   * @param args
   * @returns data set to used by the graph for client side.
   * The data is used for boardview page like graph. The selected area, building and team will be filtered
   * to get the data to ingest to the line graph.
   */
  @Query((returns) => [OPerAreaGraph], { defaultValue: [] })
  async PerAreaGraph(@Args() args: AreaGraphArgs): Promise<IPerAreaGraph[]> {
    return await this.dashboardService.getPerAreaGraph(args);
  }
  /**
   *
   * @param args
   * @returns list of available date and time very 30 minutes
   * list from employee_logs_detailed.
   * It means that all date and time from employee_logs_detailed has been group together
   * and created a distinct datelist and pass this to the date and time droplist selection to client side.
   */
  @Query((returns) => [ODateSelect], { defaultValue: [] })
  async DateSelectList(@Args() args: DateSelectArgs): Promise<IDateSelect[]> {
    return await this.dashboardService.getDateSelectList(args);
  }

  /**
   * Retrieves the attendance table list from Redis.
   * This method fetches the serialized attendance table data stored in Redis,
   * parses it from a JSON string back into an object, and returns it.
   * The attendance table data includes information such as employee attendance records.
   *
   * @returns {Promise<IAttendanceTable>} A promise that resolves to the attendance table data.
   * If the data is not found in Redis, it returns an empty array as specified by the `defaultValue` in the `@Query` decorator.
   */
  @Query((returns) => [OAttendanceTable], { defaultValue: [] })
  async AttendanceTableList(): Promise<IAttendanceTable> {
    return JSON.parse(await this.redis.get('attendanceTableData'));
  }
  /**
   * Retrieves the total attendance data from Redis.
   * This method fetches the serialized total attendance data stored in Redis,
   * parses it from a JSON string back into an object, and returns it.
   * The total attendance data includes aggregated information such as total number of employees present.
   *
   * @returns {Promise<IAttendanceTotal>} A promise that resolves to the total attendance data.
   * If the data is not found in Redis, it returns an empty array as specified by the `defaultValue` in the `@Query` decorator.
   */
  @Query((returns) => [OAttendanceTotal], { defaultValue: [] })
  async AttendanceTableTotal(): Promise<IAttendanceTotal> {
    return JSON.parse(await this.redis.get('attendanceTableTotalData'));
  }
}
