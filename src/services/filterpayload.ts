import {
  IPayloadEmployeeBoardWithRatio,
  IEmployeeBoardArgs,
  IViewEmployeeBoard,
} from '@viewModels/viewTableModel';

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
    const inStatusID: number[] = [1, 2]; //在 and 他
    const awolStatusID: number = 5; //欠
    const excludeGuestBusinessArray: string[] = ['営業', 'GUEST'];
    let newPayload: IViewEmployeeBoard[] = payload.EmployeeBoardAllSub;
    newPayload = this.clientFilter(newPayload, args);
    const currentWorkerCount: number = newPayload
      .filter((x) => inStatusID.some((y) => y === x.statusID))
      .filter(
        (x) =>
          !excludeGuestBusinessArray.some((y) => x.displayName.includes(y)),
      )
      .filter((x) => x.onShift === 1).length;
    const ketsuWorkerCount: number = newPayload.filter(
      (x) => x.statusID === awolStatusID,
    ).length;
    const totalWorkerCount: number = newPayload
      .filter(
        (x) =>
          !excludeGuestBusinessArray.some((y) => x.displayName.includes(y)),
      )
      .filter((x) => x.onShift === 1).length;
    const currentPercent: string = `${
      totalWorkerCount !== 0
        ? String(Math.round((currentWorkerCount / totalWorkerCount) * 100))
        : 0
    }%`;
    const currentWorkerLessAwol: number = totalWorkerCount - ketsuWorkerCount;
    const currentPercentWithAwol: string = `${
      currentWorkerLessAwol !== 0
        ? String(Math.round((currentWorkerLessAwol / totalWorkerCount) * 100))
        : 0
    }%`;
    const currentWorkerOnShift: number = newPayload.filter(
      (x) => x.onShift === 1,
    ).length;
    if (typeof args.pageoffset === 'number') {
      const pagenumber: number =
        args.pagenum === 1
          ? 0
          : args.pagenum * args.pageoffset - args.pageoffset;
      const pageoffset: number =
        args.pagenum === 1 ? args.pageoffset : args.pagenum * args.pageoffset;
      newPayload = newPayload.slice(pagenumber, pageoffset);
    }

    return {
      EmployeeBoardAllSub: newPayload,
      AreaRatio: {
        currentWorkerCount,
        totalWorkerCount,
        currentWorkerLessAwol,
        currentPercentWithAwol,
        currentPercent,
        currentWorkerOnShift,
      },
    };
  }

  private static clientFilter(
    newPayload: IViewEmployeeBoard[],
    args: IEmployeeBoardArgs,
  ): IViewEmployeeBoard[] {
    return typeof args.search === 'string'
      ? newPayload.filter((i) =>
          i.displayName
            .toLowerCase()
            .includes(args.search.toLocaleLowerCase().trim()),
        )
      : this.filterByParameters(newPayload, args);
  }

  private static filterByParameters(
    payload: IViewEmployeeBoard[],
    args: IEmployeeBoardArgs,
  ): IViewEmployeeBoard[] {
    const filters: {
      key: string;
      prop: string;
    }[] = [
      { key: 'areaID', prop: 'empArea' },
      { key: 'locID', prop: 'empLoc' },
      { key: 'teamID', prop: 'teamID' },
      { key: 'posID', prop: 'posID' },
      { key: 'divID', prop: 'divID' },
      { key: 'kakariID', prop: 'kakariID' },
    ];

    filters.forEach((filter: { key: string; prop: string }) => {
      if (Array.isArray(args[filter.key]) && args[filter.key].length > 0) {
        payload = payload.filter((x: IViewEmployeeBoard) =>
          args[filter.key].some((i: number) => i === x[filter.prop]),
        );
      }
    });

    // Apply ordering if specified
    if (typeof args.order === 'number') {
      payload = this.payloadOrder(payload, args);
    }

    return payload;
  }

  private static payloadOrder(
    payload: IViewEmployeeBoard[],
    args: IEmployeeBoardArgs,
  ): IViewEmployeeBoard[] {
    const sortedPayload = () => {
      switch (args.order) {
        case 0: {
          return payload.sort((a, b) => {
            return a.posID - b.posID;
          });
        }
        case 1: {
          return payload.sort((a, b) => {
            return (
              a.statusOrder - b.statusOrder ||
              a.posID - b.posID ||
              a.displayName.localeCompare(b.displayName)
            );
          });
        }
        case 2: {
          return payload.sort((a, b) => {
            return (
              b.statusOrder - a.statusOrder ||
              a.posID - b.posID ||
              a.displayName.localeCompare(b.displayName)
            );
          });
        }
      }
    };
    return this.setGuestLastOrder(sortedPayload(), args);
  }

  /**
   *
   * @returns new payload where GUEST and 営業 is always on the last order or
   * remove Guest and 営業 on the list if filtering has day shift value
   */
  private static setGuestLastOrder(
    payload: IViewEmployeeBoard[],
    args: IEmployeeBoardArgs,
  ): IViewEmployeeBoard[] {
    const excludeGuestBusinessArray: string[] = ['営業', 'GUEST'];
    const guestBusinessArray: IViewEmployeeBoard[] = payload.filter((i) => {
      return excludeGuestBusinessArray.some((a) => i.displayName.includes(a));
    });
    const workerArray: IViewEmployeeBoard[] = payload.filter((i) => {
      return !excludeGuestBusinessArray.some((a) => i.displayName.includes(a));
    });
    const dayShiftID: number = 7; //日勤
    return Array.isArray(args.teamID) &&
      args.teamID.filter((x) => x === dayShiftID).length > 0
      ? workerArray
      : workerArray.concat(guestBusinessArray);
  }
}
