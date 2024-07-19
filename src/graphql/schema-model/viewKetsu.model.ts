import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OKetsuTable {
  @Field({ nullable: true })
  logID?: string;

  @Field({ nullable: true })
  alertType?: string;

  @Field({ nullable: true })
  workerShiftDate?: string;

  @Field({ nullable: true })
  processName?: string;

  @Field({ nullable: true })
  shiftName?: string;

  @Field({ nullable: true })
  GID?: string;

  @Field({ nullable: true })
  locName?: string;

  @Field({ nullable: true })
  teamName?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  checkerWorkerA?: string;

  @Field({ nullable: true })
  checkerWorkerB?: string;

  @Field({ nullable: true })
  checkerWorkerC?: string;

  @Field({ nullable: true })
  checkerWorkerD?: string;

  @Field({ nullable: true })
  checkerWorkerE?: string;

  @Field({ nullable: true })
  checkerWorkerF?: string;

  @Field({ nullable: true })
  confirmWorker?: string;

  @Field({ nullable: true })
  reasonDesc?: string;

  @Field({ nullable: true })
  contactDesc?: string;

  @Field({ nullable: true })
  confirmWorkerID?: string;

  @Field((type) => Int, { nullable: true })
  reasonID?: number;

  @Field((type) => Int, { nullable: true })
  iscontactID?: number;

  @Field({ nullable: true })
  createdDate?: string;

  @Field({ nullable: true })
  divName?: string;

  @Field({ nullable: true })
  kakariDesc?: string;

  @Field((type) => Boolean, { nullable: true })
  toShow?: boolean;

  @Field((type) => Int, { nullable: true })
  shiftID?: number;

  @Field({ nullable: true })
  empID?: string;

  @Field((type) => Boolean, { nullable: true })
  confirm?: boolean;
}

@ObjectType()
export class OKetsuData {
  @Field((type) => [OKetsuTable], { nullable: true, defaultValue: [] })
  absentData?: OKetsuTable[];

  @Field((type) => Int, { nullable: true })
  absentCount?: number;
}

@ObjectType()
export class OApproverData {
  @Field((type) => String, { nullable: true })
  approverEmpID?: string;

  @Field((type) => String, { nullable: true })
  displayName?: string;
}

@ObjectType()
export class OIISContactList {
  @Field((type) => Int, { nullable: true })
  contactID?: number;

  @Field((type) => String, { nullable: true })
  contactDesc?: string;
}

@ObjectType()
export class OReasonList {
  @Field((type) => Int, { nullable: true })
  reasonID?: number;

  @Field((type) => String, { nullable: true })
  reasonDesc?: string;
}
