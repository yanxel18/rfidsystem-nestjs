import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { IViewDropList, IViewDropListQuery, IViewEmployeeBoard } from './model/viewModel/viewTableModel';
import { PrismaErrorCode } from './errcode/errorcode';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
 
  async employee_list(): Promise<IViewEmployeeBoard[]> {
    try {
      return await this.prisma.$queryRaw<
      IViewEmployeeBoard[]
      >`select * from view_employee_board`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) { 
        if (err.code ===  PrismaErrorCode.P2010) {
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
        if (err.code ===  PrismaErrorCode.P2010) {
          throw new Error('Database connection Error!');
        }
      } else throw err;
    }
  }
}