import { Injectable } from '@nestjs/common';
import {
  IPayloadEmployeeBoardWithRatio,
  IEmployeeBoardArgs,
  IViewEmployeeBoard,
} from 'src/model/viewModel/viewTableModel';

export class PayloadFilter {
  /**
   *
   * @param payload
   * @param variables
   * @returns  the new subscription payload used fro subscription directive @Subscription for
   * EmployeeBoardAllSub.
   */
  public static payloadFilter(
    payload: IPayloadEmployeeBoardWithRatio,
    args: IEmployeeBoardArgs,
  ): IPayloadEmployeeBoardWithRatio {
    const excludeStatusID: number[] = [3, 4];
    let newPayload = payload.EmployeeBoardAllSub;
    let currentWorkerCount = 0;
    let totalWorkerCount = 0;
    let currentPercent = '0/0';
    newPayload = this.clientFilter(newPayload, args);
    currentWorkerCount = newPayload.filter(
      (x) =>
        x.statusID === 1 && !excludeStatusID.some((ex) => x.statusID === ex),
    ).length;
    totalWorkerCount = newPayload.filter(
      (x) => !excludeStatusID.some((ex) => x.statusID === ex),
    ).length;
    currentPercent = `${
      totalWorkerCount !== 0
        ? Math.round((currentWorkerCount / totalWorkerCount) * 100).toString()
        : 0
    }%`;
    if (typeof args.pageoffset === 'number') {
      const pagenumber: number =
        args.pagenum === 1
          ? 0
          : args.pagenum * args.pageoffset - args.pageoffset;
      const pageoffset: number =
        args.pagenum === 1 ? args.pageoffset : args.pagenum * args.pageoffset;
      newPayload = newPayload.slice(pagenumber, pageoffset);
    }
    payload = {
      EmployeeBoardAllSub: newPayload,
      AreaRatio: {
        currentWorkerCount,
        totalWorkerCount,
        currentPercent,
      },
    };
    return payload;
  }

  public static clientFilter(
    newPayload: IViewEmployeeBoard[],
    args: IEmployeeBoardArgs,
  ): IViewEmployeeBoard[] {
    if (typeof args.search === 'string')
      newPayload = newPayload.filter((i) =>
        i.displayName
          .toLowerCase()
          .includes(args.search.toLocaleLowerCase().trim()),
      );
    else {
      if (typeof args.areaID === 'number')
        newPayload = newPayload.filter((i) => i.empArea === args.areaID);
      if (typeof args.locID === 'number')
        newPayload = newPayload.filter((i) => i.empLoc === args.locID);
      if (typeof args.teamID === 'number')
        newPayload = newPayload.filter((i) => i.teamID === args.teamID);
      if (typeof args.posID === 'number')
        newPayload = newPayload.filter((i) => i.posID === args.posID);
      if (typeof args.divID === 'number')
        newPayload = newPayload.filter((i) => i.divID === args.divID);
      if (typeof args.order === 'number') {
        switch (args.order) {
          case 1: {
            newPayload = newPayload.sort((a, b) => {
              return (
                a.statusOrder - b.statusOrder ||
                a.displayName.localeCompare(b.displayName)
              );
            });
            break;
          }
          case 2: {
            newPayload = newPayload.sort((a, b) => {
              return (
                b.statusOrder - a.statusOrder ||
                a.displayName.localeCompare(b.displayName)
              );
            });
            break;
          }
        }
      }
    }
    return newPayload;
  }
}
