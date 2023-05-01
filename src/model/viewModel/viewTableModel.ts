export interface IViewEmployeeBoard {
  empID: string
  tagID: string
  lastUpdate: string | null
  timeElapse: string | null
  displayName: string | null
  statusID: number | null
  sign: string | null
  readwriterID: number | null
  comment: string | null
  areaID: number | null
  areaDesc: string | null
  alarm: boolean | null
  setAlarm: boolean | null
  setCount: boolean | null
  locID: number | null
  locDesc: string | null
  floor: string | null
  buildloc: string | null
  empProcessID: number | null
  processName: string | null
  teamID: number | null
  teamName: string | null
  leaveStart: Date | null
  leaveEnd: Date | null
  leaveType: number | null
  empLoc: number | null
  empArea: number | null
  divID: number | null
  posID: number | null
}
 
export interface IPayloadEmployeeBoard {
  EmployeeBoardAllSub: IViewEmployeeBoard[]  | []
}

export interface IPayloadEmployeeBoardWithRatio { 
    EmployeeBoardAllSub: IViewEmployeeBoard[] 
    AreaRatio: IEmployeeCountRatio | null
  
}
export interface IEmployeeCountRatio {
  currentPercent?: string | null
  currentWorkerCount?: number | null
  totalWorkerCount?: number | null
}
export interface IEmployeeBoardArgs {
  search?: string | null
  areaID?: number | null
  teamID?: number | null
  locID?: number | null
  posID?: number | null
  pageoffset?: number | null
  pagenum?: number | null 
}

export interface IAreaList {
  areaID: number
  areaDesc: string
}

export interface ILocationList {
  locID: number
  buildloc: string
}

export interface ITeamList {
  teamID: number
  teamName: string
}

export interface IPositionList {
  posID: number
  posName: string
}

export interface IViewDropListQuery {
  ViewDropList: string
}
export interface IViewDropList {
  IAreaList?: IAreaList[] | []
  ILocationList?: ILocationList[] | []
  ITeamList?: ITeamList[] | []
  IPositionList?: IPositionList[] | [] 
}

export interface IReponseComment {
  status?: string
}

 

export interface ITotalAreaStatistics {
  workerInTotal: number | null
  workerAllTotal: number | null
  workerInPercentage: number | null
}

export interface IPerAreaStatistics {
  bldgName: string | null
  actualProc: string | null
  workerInTotal: number | null
  workerTotal: number | null
  workerInPercent: number | null
}

export interface IPerAreaGraph {
    DateSelect: string | null
    WorkerRate: number | null
}

export interface IDateSelect {
  DateSelect: string
}