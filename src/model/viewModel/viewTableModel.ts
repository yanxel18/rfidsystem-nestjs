export interface IViewEmployeeBoard {
  empID: string;
  tagID: string;
  lastUpdate: string | null;
  timeElapse: string | null;
  displayName: string | null;
  statusID: number | null;
  sign: string | null;
  readwriterID: number | null;
  comment: string | null;
  areaID: number | null;
  areaDesc: string | null;
  alarm: boolean | null;
  setAlarm: string | null;
  setCount: boolean | null;
  locID: number | null;
  locDesc: string | null;
  floor: string | null;
  buildloc: string | null;
  empProcessID: number | null;
  processName: string | null;
  teamID: number | null;
  teamName: string | null;
  leaveStart: Date | null;
  leaveEnd: Date | null;
  leaveType: number | null;
  empLoc: number | null;
  empArea: number | null;
  divID: number | null;
  posID: number | null;
  statusOrder: number | null;
  kakariID: number | null;
  kakariDesc: string | null;
  onShift: number | null;
}

export interface IPayloadEmployeeBoard {
  EmployeeBoardAllSub: IViewEmployeeBoard[] | [];
}

export interface IPayloadEmployeeBoardWithRatio {
  EmployeeBoardAllSub: IViewEmployeeBoard[];
  AreaRatio: IEmployeeCountRatio | null;
}
export interface IEmployeeCountRatio {
  currentPercent?: string | null;
  currentWorkerCount?: number | null;
  currentWorkerLessAwol?: number | null;
  currentPercentWithAwol?: string | null;
  totalWorkerCount?: number | null;
  currentWorkerOnShift: number | null;
}

export interface IEmployeeBoardArgs {
  search?: string | null;
  areaID?: number[] | null;
  teamID?: number[] | null;
  locID?: number[] | null;
  posID?: number[] | null;
  divID?: number[] | null;
  order?: number | null;
  kakariID?: number[] | null;
  pageoffset?: number | null;
  pagenum?: number | null;
}

export interface IAreaList {
  areaID: number;
  areaDesc: string;
}

export interface ILocationList {
  locID: number;
  buildloc: string;
}

export interface ITeamList {
  teamID: number;
  teamName: string;
}

export interface IPositionList {
  posID: number;
  posName: string;
}

export interface IDivisionList {
  divID: number;
  divName: string;
}

export interface IKakariList {
  kakariID: number;
  kakariDesc: string;
}

export interface IViewDropListQuery {
  ViewDropList: string;
}

export interface IViewDropList {
  IAreaList?: IAreaList[] | [];
  ILocationList?: ILocationList[] | [];
  ITeamList?: ITeamList[] | [];
  IPositionList?: IPositionList[] | [];
  IDivisionList?: IDivisionList[] | [];
  IKakariList?: IKakariList[] | [];
}

export interface IStatusResponse {
  status?: string;
}

export interface ITotalAreaStatistics {
  workerInTotal: number | null;
  workerAllTotal: number | null;
  workerInPercentage: number | null;
}

export interface IPerAreaStatistics {
  bldgName: string | null;
  actualProc: string | null;
  workerInTotal: number | null;
  workerTotal: number | null;
  workerInPercent: number | null;
}

export interface IPerAreaGraph {
  DateSelect: string | null;
  WorkerRate: number | null;
}

export interface IDateSelect {
  DateSelect: string;
}

export interface IKetsuLogCSVFormat {
  アラート区分?: string;
  日付: string;
  実工程: string;
  号棟: string;
  実班: string;
  直: string;
  GID: string;
  氏名: string;
  第1勤怠確認者: string;
  第2勤怠確認者: string;
  第3勤怠確認者: string;
  第4勤怠確認者: string;
  第5勤怠確認者: string;
  第6勤怠確認者: string;
  対応確認者: string;
  内容: string;
  連絡有無: string;
  係: string;
  区分G: string;
  recipient?: string;
  confirm?: boolean;
}
