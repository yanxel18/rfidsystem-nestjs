import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OTotalStatistics {
  @Field((type) => Int, { defaultValue: 0 })
  workerInTotal: number;

  @Field((type) => Int, { defaultValue: 0 })
  workerAllTotal: number;

  @Field((type) => Float, { defaultValue: 0 })
  workerInPercentage: number;
}

@ObjectType()
export class OPerAreaStatistics {
  @Field({ nullable: true })
  bldgName: string | null;

  @Field({ nullable: true })
  actualProc: string | null;

  @Field((type) => Int, { nullable: true })
  workerInTotal: number | null;

  @Field((type) => Int, { nullable: true })
  workerTotal: number | null;

  @Field((type) => Float, { nullable: true })
  workerInPercent: number | null;
}

@ObjectType()
export class OPerAreaGraph {
  @Field({ nullable: true })
  DateSelect: string | null;

  @Field((type) => Float, { nullable: true })
  WorkerRate: number | null;
}

@ObjectType()
export class OAttendanceTable {
  @Field((type) => Int, { nullable: true })
  divID: number | null;

  @Field({ nullable: true })
  divName: string | null;

  @Field((type) => Int, { nullable: true })
  kakariID: number | null;

  @Field({ nullable: true })
  kakariDesc: string | null;

  @Field((type) => Int, { nullable: true })
  koutaiInCount: number | null;

  @Field((type) => Int, { nullable: true })
  koutaiTotalCount: number | null;

  @Field((type) => Int, { nullable: true })
  koutaiPercent: number | null;

  @Field((type) => Int, { nullable: true })
  dayShiftInCount: number | null;

  @Field((type) => Int, { nullable: true })
  dayShiftTotalCount: number | null;

  @Field((type) => Int, { nullable: true })
  dayShiftPercent: number | null;

  @Field((type) => Int, { nullable: true })
  normalShiftInCount: number | null;

  @Field((type) => Int, { nullable: true })
  normalShiftTotalCount: number | null;

  @Field((type) => Int)
  normalShiftPercent: number;
}

@ObjectType()
export class OAttendanceTotal {
  @Field((type) => Int, { nullable: true })
  workerInTotal: number | null;

  @Field((type) => Int, { nullable: true })
  workerAllTotal: number | null;

  @Field((type) => Int, { nullable: true })
  workerInPercent: number | null;

  @Field({ nullable: true })
  totalTeamName: string | null;
}
