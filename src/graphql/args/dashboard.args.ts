import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

 
@ArgsType()
export class AreaStatisticArgs {
    @IsNotEmpty({message: "Selected area must not be empty."})
    @Field(type=> String)
    areaSelectedDate: string
}

@ArgsType()
export class TotalStatisticArgs {
    @IsNotEmpty({message: "Total statistics selected date should not be empty."})
    @Field(type=> String)
    totalStatSelectedDate: string
}

@ArgsType()
export class AreaGraphArgs {
    @Field(type=> Int, { nullable : true})
    areaID: number

    @Field(type=> Int,  { nullable : true})
    locID: number

    @Field(type=> Int,  { nullable : true})
    teamID: number
}

@ArgsType()
export class DateSelectArgs{
    @Field(type => String, { nullable: true})
    dateFrom?: string
}