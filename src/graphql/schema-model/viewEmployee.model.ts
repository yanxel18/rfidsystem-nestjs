import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmployeeBoard {
  @Field()
  empID: string;

  @Field()
  tagID: string;

  @Field({ nullable: true })
  lastUpdate?: string;

  @Field({ nullable: true })
  timeElapse?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field(() => Int)
  statusID: number;

  @Field({ nullable: true })
  sign?: string;

  @Field((type) => Int, { nullable: true })
  readwriterID?: number;

  @Field({ nullable: true })
  comment?: string;

  @Field((type) => Int, { nullable: true })
  areaID?: number;

  @Field({ nullable: true })
  areaDesc?: string;

  @Field((type) => Int, { nullable: true })
  alarm?: number;

  @Field((type) => Int, { nullable: true })
  setAlarm?: number;

  @Field((type) => Int, { nullable: true })
  setCount?: number;

  @Field((type) => Int, { nullable: true })
  locID?: number;

  @Field({ nullable: true })
  locDesc?: string;

  @Field({ nullable: true })
  floor?: string;

  @Field({ nullable: true })
  buildloc?: string;

  @Field((type) => Int, { nullable: true })
  empProcessID?: number;

  @Field({ nullable: true })
  processName?: string;

  @Field((type) => Int, { nullable: true })
  teamID?: number | null;

  @Field({ nullable: true })
  teamName?: string;

  @Field({ nullable: true })
  leaveStart?: Date;

  @Field({ nullable: true })
  leaveEnd?: Date;

  @Field((type) => Int, { nullable: true })
  leaveType?: number;

  @Field((type) => Int, { nullable: true })
  empLoc?: number | null;

  @Field((type) => Int, { nullable: true })
  empArea?: number | null;
}

 

@ObjectType()
export class EmployeeBoardAllSub {
  @Field((type) => [EmployeeBoard], { nullable: true })
  EmployeeBoardAllSub: EmployeeBoard[]; 

  @Field((type) => EmployeeCountRatio, { nullable: true })
  AreaRatio: Partial<EmployeeCountRatio>; 
}
 

@ObjectType()
export class EmployeeBoardCount {
  @Field((type) => Int, { nullable: true })
  EmpCount?: number;
}
 
@ObjectType()
export class EmployeeCountRatio {
  @Field({ nullable: true })
  currentPercent?: string;

  @Field({ nullable: true })
  currentWorkerCount?: number;

  @Field({ nullable: true })
  totalWorkerCount?: number;

}