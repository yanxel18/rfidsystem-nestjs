import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaErrorCode } from 'src/errcode/errorcode';
import { Args } from '@nestjs/graphql';
import {
  IApproverList,
  IEmployeeList,
  IIsContactList,
  IKetsuData,
  IKetsuTable,
  IReasonList,
  ZApproverList,
  ZKetsuData,
} from 'src/model/validator/ketsuvalidator';
import {
  AbsentValueArgs,
  ApproverNameArgs,
  KetsuArgs,
} from 'src/graphql/args/dashboard.args';
import {
  IKetsuLogCSVFormat,
  IStatusResponse,
} from '@viewModels/viewTableModel';
import crypto from 'crypto';
import moment from 'moment-timezone';
import { json2csv } from 'json-2-csv';
import path from 'path';
import fs from 'fs';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
@Injectable()
export class KetsuBoardService {
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private redis: Redis,
  ) {}

  async getKetsuLogs(@Args() args: KetsuArgs): Promise<IKetsuData> {
    try {
      const absentData: IKetsuTable =
        await this.prisma.view_ketsu_logs.findMany({
          skip: this.newPageNum(args),
          take: args.take,
          where: {
            toShow: args.toShow,
          },
          orderBy: [
            {
              createdDate: 'desc',
            },
            {
              workerShiftDate: 'desc',
            },
            {
              shiftID: 'desc',
            },
            {
              processName: 'asc',
            },
          ],
        });
      const countLogs = await this.prisma.view_ketsu_logs.aggregate({
        where: {
          toShow: args.toShow,
        },
        _count: {
          toShow: true,
        },
      });
      const returnData: IKetsuData = {
        absentData: absentData ?? null,
        absentCount: countLogs._count.toShow ?? 0,
      };

      this.redis.set('ketsuDataLogs', JSON.stringify(returnData));
      const ketsuData = JSON.parse(await this.redis.get('ketsuDataLogs'));
      return (await ZKetsuData.safeParseAsync(ketsuData)).success
        ? ketsuData
        : null;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
    }
  }
  async getApproverList(
    @Args() args: ApproverNameArgs,
  ): Promise<IApproverList> {
    try {
      const approverList: IEmployeeList =
        await this.prisma.rf_employee_list.findMany({
          select: {
            rfe_emp_id: true,
            rfe_displayname: true,
          },
          where: {
            rfe_displayname: {
              contains: args.approverName ?? undefined,
            },
            rfe_pos_id: {
              lte: 10,
            },
            NOT: [
              {
                rfe_displayname: {
                  contains: 'GUEST',
                },
              },
              {
                rfe_displayname: {
                  contains: '営業',
                },
              },
            ],
            rfe_deleted: false,
            rfe_active: true,
          },
          orderBy: [
            {
              rfe_pos_id: 'asc',
            },
          ],
        });

      return await ZApproverList.parseAsync(
        approverList.map((approver) => ({
          approverEmpID: approver.rfe_emp_id,
          displayName: approver.rfe_displayname,
        })),
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
      throw new BadRequestException(err.message);
    }
  }

  async updateAbsentWorker(
    @Args() args: AbsentValueArgs,
  ): Promise<IStatusResponse> {
    try {
      const logUpdate: Prisma.BatchPayload =
        await this.prisma.rf_ketsu_logs.updateMany({
          where: {
            AND: [
              {
                rkd_emp_id: args.selectedEmpID,
              },
              {
                rkd_ketsu_logs_id: args.logID,
              },
            ],
          },
          data: {
            rkd_checker_emp_id: args.approverEmpID,
            rkd_reason_id: args.reasonID,
            rkd_contact_id: args.contactID,
            rkd_modified_date: this.getTimeNow,
            rkd_confirm: true,
          },
        });

      const getStatusAndArea = await this.prisma.rf_ketsu_reason_list.findFirst(
        {
          select: {
            rs_status_id: true,
            rs_rwl_id: true,
          },
          where: {
            rs_reason_id: args.reasonID,
            rs_deleted: false,
          },
        },
      );

      const updateBoard: Prisma.BatchPayload =
        await this.prisma.rf_employee_board.updateMany({
          data: {
            rbe_rwl_id: getStatusAndArea.rs_rwl_id,
            rbe_status_id: getStatusAndArea.rs_status_id,
            rbe_lastupdate_date: this.getTimeNow,
          },
          where: {
            rbe_emp_id: args.selectedEmpID,
            rbe_status_id: {
              not: 1,
            },
          },
        });
      await Promise.all([
        logUpdate,
        updateBoard,
        this.createEmployeeLogs(args.selectedEmpID),
      ]);

      return {
        status: 'success',
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(err.message);
    }
  }

  private async createEmployeeLogs(empID: string): Promise<number | null> {
    const getEmployeeBoardStatus =
      await this.prisma.rf_employee_board.findFirst({
        where: {
          rbe_emp_id: empID,
        },
      });

    const createEmployeeLogs = await this.prisma.rf_employee_logs.create({
      data: {
        rel_emp_id: getEmployeeBoardStatus.rbe_emp_id,
        rel_taginfo_id: getEmployeeBoardStatus.rbe_taginfo_id,
        rel_rwl_id: getEmployeeBoardStatus.rbe_rwl_id,
        rel_datetime: this.getTimeNow,
        rel_status_id: getEmployeeBoardStatus.rbe_status_id,
      },
    });
    return createEmployeeLogs.rel_id;
  }

  get getTimeNow(): string {
    return moment().tz('Asia/Tokyo').add(9, 'hours').format();
  }

  async getisContactList(): Promise<IIsContactList> {
    return await this.prisma.view_ketsu_contact_list.findMany();
  }

  async getReasonList(): Promise<IReasonList> {
    return await this.prisma.view_ketsu_reason_list.findMany();
  }

  newPageNum(@Args() args: KetsuArgs): number {
    const pageNumber: number = 0;
    if (typeof args.skip === 'number' && typeof args.take === 'number') {
      return args.skip === 1 ? 0 : (args.skip - 1) * args.take;
    }
    return pageNumber;
  }
  async downloadKetsuLogs(@Args() args: KetsuArgs): Promise<string | null> {
    try {
      const fetchLogs: IKetsuTable = await this.fetchKetsuLogs(args);

      if (fetchLogs.length === 0) {
        return null;
      }

      const csv: string = json2csv(
        this.mapKetsuLogsFormat(fetchLogs, false).map((logs) => {
          const { recipient, confirm, ...cleanData } = logs;
          return cleanData;
        }),
      );
      const filename: string = `ketsu_logs_${crypto.randomUUID()}.csv`;
      const filePath: string = path.join(
        __dirname,
        '../../',
        'downloads',
        filename,
      );
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      fs.writeFileSync(filePath, '\uFEFF' + csv, 'utf8');
      return `${process.env.SERVER_URL}/downloads/${filename}`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException(err.message);
    }
  }

  async fetchKetsuLogs(@Args() args: KetsuArgs): Promise<IKetsuTable | []> {
    return await this.prisma.view_ketsu_logs.findMany({
      skip: this.newPageNum(args),
      take: args.take,
      select: {
        alertType: true,
        workerShiftDate: true,
        processName: true,
        shiftName: true,
        GID: true,
        locName: true,
        teamName: true,
        displayName: true,
        checkerWorkerA: true,
        checkerWorkerB: true,
        checkerWorkerC: true,
        checkerWorkerD: true,
        checkerWorkerE: true,
        checkerWorkerF: true,
        confirmWorker: true,
        reasonDesc: true,
        contactDesc: true,
        divName: true,
        kakariDesc: true,
        recipient: true,
        confirm: true,
      },
      where: {
        toShow: args.toShow,
      },
      orderBy: [
        {
          createdDate: 'desc',
        },
        {
          processName: 'asc',
        },
        {
          shiftID: 'asc',
        },
      ],
    });
  }
  mapKetsuLogsFormat(
    ketsuLogsToCSV: IKetsuTable,
    forEmail: boolean,
  ): IKetsuLogCSVFormat[] {
    return ketsuLogsToCSV.map((d) => ({
      ...(forEmail ? { アラート区分: d.alertType } : {}),
      日付: moment(d.workerShiftDate).format('YYYY-MM-DD'),
      実工程: d.processName,
      号棟: d.locName,
      実班: d.teamName,
      直: d.shiftName,
      GID: d.GID,
      氏名: d.displayName,
      区分G: d.divName,
      係: d.kakariDesc,
      第1勤怠確認者: d.checkerWorkerA ?? 'ー',
      第2勤怠確認者: d.checkerWorkerB ?? 'ー',
      第3勤怠確認者: d.checkerWorkerC ?? 'ー',
      第4勤怠確認者: d.checkerWorkerD ?? 'ー',
      第5勤怠確認者: d.checkerWorkerE ?? 'ー',
      第6勤怠確認者: d.checkerWorkerF ?? 'ー',
      対応確認者: d.confirmWorker ?? 'ー',
      内容: d.reasonDesc ?? 'ー',
      連絡有無: d.contactDesc ?? 'ー',
      recipient: d.recipient,
      confirm: d.confirm,
    }));
  }
}
