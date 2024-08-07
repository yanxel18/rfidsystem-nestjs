import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import {
  IDateSelect,
  IPerAreaGraph,
  IPerAreaStatistics,
  ITotalAreaStatistics,
  IViewDropListQuery,
} from '@viewModels/viewTableModel';
import { PrismaErrorCode } from 'src/errcode/errorcode';
import { Args } from '@nestjs/graphql';
import {
  AreaGraphArgs,
  AreaStatisticArgs,
  DateSelectArgs,
  TotalStatisticArgs,
} from 'src/graphql/args/dashboard.args';
import {
  IAttendanceTable,
  IAttendanceTotal,
  ZAttendanceTable,
  ZAttendanceTotal,
} from 'src/model/validator/attendancevalidator';

@Injectable()
export class DashBoardService {
  constructor(private prisma: PrismaService) {}
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
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(
        'Cannot get menu selection list!',
        err.code,
      );
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
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(
        'Cannot get per area statistics data!',
        err.code,
      );
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
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(
        'Cannot get total area statistics!',
        err.code,
      );
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
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(
        'Cannot get per area graph data.',
        err.code,
      );
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
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(
        'Cannot get date list selection data.',
        err.code,
      );
    }
  }
  /**
   * Fetches attendance table data from the database using a stored procedure.
   * This method executes a raw SQL query to retrieve attendance data and then validates
   * the data structure using Zod schema validation. If the data does not conform to the
   * expected schema, it throws a BadRequestException indicating an issue with the attendance data fields.
   *
   * @returns A Promise that resolves to an `IAttendanceTable` object containing the attendance data.
   * @throws BadRequestException if the raw query fails due to a known Prisma client request error,
   * specifically if the error code is `P2010`, indicating a raw query failure. It also throws
   * this exception if the data fails Zod schema validation, indicating bad field attendance data.
   */
  async getAttendanceTable(): Promise<IAttendanceTable> {
    try {
      const data: IAttendanceTable = await this.prisma
        .$queryRaw<IAttendanceTable>` 
      EXEC [dbo].[sp_show_attendancetable]`;
      const zCheck = ZAttendanceTable.safeParseAsync(data);
      if ((await zCheck).success) return data;
      else
        throw new BadRequestException(
          'Bad field attendance data. Please contact your administrator',
        );
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(err, err.code);
    }
  }
  /**
   * Retrieves the overall attendance data from the database.
   * This method executes a stored procedure to fetch the total attendance data,
   * then validates the data structure using Zod schema validation. If the data does
   * not conform to the expected schema, it throws a BadRequestException indicating
   * an issue with the attendance data fields.
   *
   * @returns A Promise that resolves to an `IAttendanceTotal` object containing the overall attendance data.
   * @throws BadRequestException if the raw query fails due to a known Prisma client request error,
   * specifically if the error code is `P2010`, indicating a raw query failure. It also throws
   * this exception if the data fails Zod schema validation, indicating bad field attendance data.
   */
  async getAttendanceTotal(): Promise<IAttendanceTotal> {
    try {
      const data: IAttendanceTotal = await this.prisma
        .$queryRaw<IAttendanceTotal>` 
      EXEC [dbo].[sp_show_attendancetable_overall]`;
      return ZAttendanceTotal.parseAsync(data);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(err, err.code);
    }
  }
}
