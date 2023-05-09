import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import {
  IDateSelect,
  IPerAreaGraph,
  IPerAreaStatistics,
  ITotalAreaStatistics,
  IViewDropListQuery,
  IViewEmployeeBoard,
} from './model/viewModel/viewTableModel';
import { PrismaErrorCode } from './errcode/errorcode';
import { Args } from '@nestjs/graphql';
import {
  AreaGraphArgs,
  AreaStatisticArgs,
  CommentArgs,
  DateSelectArgs,
  TotalStatisticArgs,
} from './graphql/args/common-args';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @returns the display board for all employees.
   * Prisma does not support view. Thats why I always use queryRaw.
   */
  async employee_list(): Promise<IViewEmployeeBoard[]> {
    try {
      return await this.prisma.$queryRaw<
        IViewEmployeeBoard[]
      >`select * from view_employee_board order by empArea`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new Error('Database connection Error!');
        }
      } else throw err;
    }
  }
  /**
   *
   * @returns the dropdownlist for area list, location list and team list.
   */
  async getViewDropList(): Promise<IViewDropListQuery[]> {
    try {
      return await this.prisma.$queryRaw<
        IViewDropListQuery[]
      >`EXEC sp_show_dropdownlist_viewboard`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new Error('Database connection Error!');
        }
      } else throw err;
    }
  }
  /**
   *
   * @param param
   * @returns the result of an employee update or throw error.
   */
  async updateEmployeeComment(@Args() param: CommentArgs): Promise<number> {
    try {
      if (param.comment === '-' || param.comment === 'ー') {
        param = {
          ...param,
          comment: null,
        };
      }
      return await this.prisma.$executeRaw<any>`
      EXEC sp_update_comment
      @empID = ${param.empID},
      @comment = ${param.comment}`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new Error('Database connection Error!');
        }
      } else throw err;
    }
  }
  /**
   *
   * @param dateval
   * @returns Area statistics per Area on a set date interval (30 minutes).
   */
  async getPerAreaStatistics(
    @Args() args: AreaStatisticArgs,
  ): Promise<IPerAreaStatistics[]> {
    try {
      return await this.prisma.$queryRaw<IPerAreaStatistics[]>`
      select bldgName,actualProc,workerInTotal,workerTotal,workerInPercent 
      from dbo.fni_show_worker_statistics(${args.areaSelectedDate})`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw err;
      }
    }
  }
  /**
   *
   * @param dateval
   * @returns Total area count for worker inside, total workers on the area and worker percentage rate.
   */
  async getTotalAreaStatistics(
    @Args() args: TotalStatisticArgs,
  ): Promise<ITotalAreaStatistics[]> {
    try {
      return await this.prisma.$queryRaw<ITotalAreaStatistics[]>`
      EXEC [dbo].[sp_show_workertotal_statistics]
		  @dateselect = ${args.totalStatSelectedDate}`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw err;
      }
    }
  }
  /**
   *
   * @param areaID
   * @returns data from selected area and location (building name and floor).
   */
  async getPerAreaGraph(@Args() args: AreaGraphArgs): Promise<IPerAreaGraph[]> {
    try {
      return await this.prisma.$queryRaw<IPerAreaGraph[]>`
      EXEC [dbo].[sp_show_perarea_graph]
		  @pm_areaID = ${args.areaID},
      @pm_locationID = ${args.locID},
      @pm_teamID = ${args.teamID}`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw err;
      }
    }
  }
  /**
   *
   * @param dateFrom
   * @returns list of time from 00:00 to 23:30 from the selected day.
   */
  async getDateSelectList(
    @Args() args: DateSelectArgs,
  ): Promise<IDateSelect[]> {
    try {
      return await this.prisma.$queryRaw<IPerAreaGraph[]>`
      EXEC [dbo].[sp_show_dateselectlist]
		  @param_datefrom = ${args.dateFrom}`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw err;
      }
    }
  }
}
