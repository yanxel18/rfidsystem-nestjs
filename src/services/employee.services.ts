import { BadRequestException, Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { PrismaErrorCode } from 'src/errcode/errorcode';
import { CommentArgs } from 'src/graphql/args/employee.args';
import {
  IPayloadEmployeeBoardWithRatio,
  IStatusResponse,
  IViewEmployeeBoard,
} from 'src/model/viewModel/viewTableModel';
import { PrismaService } from 'src/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
@Injectable()
export class EmployeeService {
  pubSub = new PubSub();
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private redis: Redis,
  ) {}

  EmployeeBoardAll(): void {
    /**
     * this interval queries in the database every 1second to the view_employee_board
     * and store it in the cache memory with retention period of 5 seconds.
     */
    setInterval(() => {
      this.employee_list().then((data) => {
        const returndata: IPayloadEmployeeBoardWithRatio = {
          EmployeeBoardAllSub: data,
          AreaRatio: null, //do something !! if already query then loop! or delay?!
        };
        this.redis.set('employeeAllView', JSON.stringify(returndata));
      });
    }, 1000);
  }
  /**
   *
   * @returns the display board for all employees.
   * Prisma does not support view. Thats why I always use queryRaw.
   */
  async employee_list(): Promise<IViewEmployeeBoard[]> {
    try {
      return await this.prisma.view_employee_board.findMany({
        orderBy: {
          empArea: 'asc',
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === PrismaErrorCode.P2010) {
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
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
  ): Promise<IStatusResponse> {
    try {
      if (typeof param.comment === 'string') {
        param =
          param.comment == '-' || param.comment == 'ー'
            ? {
                ...param,
                comment: null,
              }
            : {
                ...param,
                comment: param.comment.trim(),
              };
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
          throw new BadRequestException(
            `Raw query failed. ${err.message}`,
            err.code,
          );
        }
      }
      throw new BadRequestException('Cannot update comment!', err.code);
    }
  }
}
