import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsUUID,
  Max,
  MaxLength,
  ValidateIf,
} from 'class-validator';

@ArgsType()
export class AreaStatisticArgs {
  @IsNotEmpty({ message: 'Selected area must not be empty.' })
  @MaxLength(20, { message: 'Date value is too long!' })
  @Field((type) => String)
  readonly areaSelectedDate: string;
}

@ArgsType()
export class TotalStatisticArgs {
  @IsNotEmpty({
    message: 'Total statistics selected date should not be empty.',
  })
  @MaxLength(20, { message: 'Date value is too long!' })
  @Field((type) => String)
  readonly totalStatSelectedDate: string;
}

@ArgsType()
export class AreaGraphArgs {
  @Max(32767, { message: 'areaID exceeds the acceptable value.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int)
  readonly areaID: number;

  @Max(32767, { message: 'locID exceeds the acceptable value.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int)
  readonly locID: number;

  @Max(255, { message: 'teamID exceeds the acceptable value.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int)
  readonly teamID: number;
}

@ArgsType()
export class DateSelectArgs {
  @MaxLength(20, { message: 'Date value is too long!' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => String, { nullable: true })
  readonly dateFrom?: string;
}

@ArgsType()
export class KetsuArgs {
  @Field((type) => Boolean, { defaultValue: false })
  readonly toShow: boolean;

  @Field((type) => Int, { nullable: true })
  readonly skip: number;

  @Field((type) => Int, { nullable: true })
  readonly take: number;
}

@ArgsType()
export class ApproverNameArgs {
  @MaxLength(100, { message: 'approverName is too long!' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => String, { nullable: true })
  readonly approverName?: string;
}

@ArgsType()
export class AbsentValueArgs {
  @IsNotEmpty({ message: 'logID must not be empty' })
  @IsUUID('all', { each: true, message: 'logID is not a valid format!' })
  @MaxLength(50, { message: 'logID value is too long!' })
  @Field((type) => String)
  readonly logID: string;

  @IsNotEmpty({ message: 'selectedEmpID must not be empty' })
  @IsUUID('all', {
    each: true,
    message: 'selectedEmpID is not a valid format!',
  })
  @MaxLength(50, { message: 'selectedEmpID value is too long!' })
  @Field((type) => String)
  readonly selectedEmpID: string;

  @IsUUID('all', {
    each: true,
    message: 'approverEmpID is not a valid format!',
  })
  @ValidateIf((_object, value) => value !== null)
  @MaxLength(50, { message: 'approverEmpID value is too long!' })
  @Field((type) => String, { nullable: true })
  readonly approverEmpID?: string;

  @ValidateIf((_object, value) => value !== null)
  @Max(255, { message: 'reasonID exceeds the acceptable value.' })
  @Field((type) => Number, { nullable: true })
  readonly reasonID?: number;

  @ValidateIf((_object, value) => value !== null)
  @Max(255, { message: 'contactID exceeds the acceptable value.' })
  @Field((type) => Number, { nullable: true })
  readonly contactID?: number;
}
