import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import {
  IPerAreaGraph,
  IPerAreaStatistics,
  ITotalAreaStatistics,
  IUpdateCommentArgs,
  IViewDropListQuery,
  IViewEmployeeBoard
} from './model/viewModel/viewTableModel';
import { PrismaErrorCode } from './errcode/errorcode';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
/**
 * 
 * @returns the display board for all employees.
 */
  async employee_list(): Promise<IViewEmployeeBoard[]> {
    try {
      return await this.prisma.$queryRaw<IViewEmployeeBoard[]>
      `select * from view_employee_board order by empArea`;
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
  async updateEmployeeComment(param: IUpdateCommentArgs): Promise<number> {
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
    dateval: string,
  ): Promise<IPerAreaStatistics[]> {
    try {
      return await this.prisma.$queryRaw<IPerAreaStatistics[]>`
      select bldgName,actualProc,workerInTotal,workerTotal,workerInPercent 
      from dbo.fni_show_worker_statistics(${dateval})`;
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
    dateval: string,
  ): Promise<ITotalAreaStatistics[]> {
    try {
      return await this.prisma.$queryRaw<ITotalAreaStatistics[]>`
      EXEC [dbo].[sp_show_workertotal_statistics]
		  @dateselect = ${dateval}`;
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
  async getPerAreaGraph(
    areaID: number,
    locID: number,
    teamID: number
  ): Promise<IPerAreaGraph[]> {
    try {
      return await this.prisma.$queryRaw<IPerAreaGraph[]>`
      EXEC [dbo].[sp_show_perarea_graph]
		  @pm_areaID = ${areaID},
      @pm_locationID = ${locID},
      @pm_teamID = ${teamID}`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw err;
      }
    }
  }
}
