import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import {
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
}
