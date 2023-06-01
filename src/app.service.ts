import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import {
  IDateSelect,
  IPerAreaGraph,
  IPerAreaStatistics,
  IReponseComment,
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
          throw new InternalServerErrorException(err.message, err.code);
        }
      }
      throw new BadRequestException ("Cannot get monitoring data!",err.code);
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
          throw new InternalServerErrorException(err.message, err.code);
        }
      }
      throw new BadRequestException ("Cannot get menu selection list!",err.code);
    }
  }
  /**
   *
   * @param param
   * @returns the result of an employee update or throw error.
   */
  async updateEmployeeComment(@Args() param: CommentArgs): Promise<IReponseComment> {
    const notAllowed: string[] = ['-', 'ー'];
    const stringReg: RegExp = /^[a-zA-Z0-9]+$/i;
    try {
      if (typeof param.comment === 'string') {
        if (
          notAllowed.some((str) => param.comment.includes(str)) &&
          param.comment.length > 1 &&
          !stringReg.test(param.comment)
        ) {
          param = {
            ...param,
            comment: null,
          };
        } else {
          param = {
            ...param,
            comment: param.comment.trim(),
          };
        }
      }
      const result = await this.prisma.$executeRaw<any>`
      EXEC sp_update_comment
      @empID = ${param.empID},
      @comment = ${param.comment}`;
      if (result === 0) {
        return {
          status: 'success',
        }
      } 
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new InternalServerErrorException(err.message, err.code);
        }
      } 
      throw new BadRequestException ("Cannot update comment!",err.code);
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
        if (err.code === PrismaErrorCode.P2010) {
          throw new InternalServerErrorException(err.message, err.code);
        }
      } 
      throw new BadRequestException ("Cannot get per area statistics data!",err.code);
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
        if (err.code === PrismaErrorCode.P2010) {
          throw new InternalServerErrorException(err.message, err.code);
        }
      }
      throw new BadRequestException ("Cannot get total area statistics!",err.code);
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
        if (err.code === PrismaErrorCode.P2010) {
          throw new InternalServerErrorException(err.message, err.code);
        }
      }
      throw new BadRequestException ("Cannot get per area graph data.",err.code);
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
        if (err.code === PrismaErrorCode.P2010) {
          throw new InternalServerErrorException(err.message, err.code);
        }
      }
      throw new BadRequestException ("Cannot get date list selection data.",err.code);
    }
  }
}