import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, Max, MaxLength, ValidateIf } from 'class-validator';

@ArgsType()
export class AreaStatisticArgs {
  @IsNotEmpty({ message: 'Selected area must not be empty.' })
  @MaxLength(20, { message: 'Date value is too long!' })
  @Field((type) => String)
  areaSelectedDate: string;
}

@ArgsType()
export class TotalStatisticArgs {
  @IsNotEmpty({
    message: 'Total statistics selected date should not be empty.',
  })
  @MaxLength(20, { message: 'Date value is too long!' })
  @Field((type) => String)
  totalStatSelectedDate: string;
}

@ArgsType()
export class AreaGraphArgs {
  @Max(32767, { message: 'areaID must not be greater than 32767.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int, { nullable: true })
  areaID: number;

  @Max(32767, { message: 'locID must not be greater than 32767.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int, { nullable: true })
  locID: number;

  @Max(32767, { message: 'teamID must not be greater than 32767.' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => Int, { nullable: true })
  teamID: number;
}

@ArgsType()
export class DateSelectArgs {  
  @MaxLength(20, { message: 'Date value is too long!' })
  @ValidateIf((_object, value) => value !== null) 
  @Field((type) => String, { nullable: true })
  dateFrom?: string;
}
