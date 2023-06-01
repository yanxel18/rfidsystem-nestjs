import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { PrismaErrorCode } from 'src/errcode/errorcode';
import { CommentArgs } from 'src/graphql/args/employee.args';
import {
  IPayloadEmployeeBoardWithRatio,
  IReponseComment,
  IViewEmployeeBoard,
} from 'src/model/viewModel/viewTableModel';
import { PrismaService } from 'src/prisma.service';
import { Cache } from 'cache-manager';
import { PubSub } from 'graphql-subscriptions';
@Injectable()
export class EmployeeService {
  pubSub = new PubSub();
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async EmployeeBoardAll(): Promise<void> {
    /**
     * this interval queries in the database every 1second to the view_employee_board
     * and store it in the cache memory with retention period of 5 seconds.
     */
    setInterval(async () => {
      const returndata: IPayloadEmployeeBoardWithRatio = {
        EmployeeBoardAllSub: await this.employee_list(),
        AreaRatio: null, //do something !! if already query then loop! or delay?!
      };
      this.cache.set('employeeAllView', returndata, 5000);
    }, 1000);
  }
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
      throw new BadRequestException('Cannot get monitoring data!', err.code);
    }
  }
  /**
   *
   * @param param
   * @returns the result of an employee update or throw error.
   */
  async updateEmployeeComment(
    @Args() param: CommentArgs,
  ): Promise<IReponseComment> {
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
        };
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new InternalServerErrorException(err.message, err.code);
        }
      }
      throw new BadRequestException('Cannot update comment!', err.code);
    }
  }
}
