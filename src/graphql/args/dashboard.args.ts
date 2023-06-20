import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Max, MaxLength, ValidateIf } from 'class-validator';

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
  @Field((type) => Int, { nullable: true })
  readonly areaID: number;

  @Max(32767, { message: 'locID exceeds the acceptable value.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int, { nullable: true })
  readonly locID: number;

  @Max(32767, { message: 'teamID exceeds the acceptable value.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int, { nullable: true })
  readonly teamID: number;
}

@ArgsType()
export class DateSelectArgs {
  @MaxLength(20, { message: 'Date value is too long!' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => String, { nullable: true })
  readonly dateFrom?: string;
}
