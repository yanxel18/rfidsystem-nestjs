import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class EmployeeBoardArgs {

    @Field(type => Int, { nullable: true})
    areaID?: number

    @Field(type => Int, { nullable: true})
    teamID?: number

    @Field(type => Int, { nullable: true})
    locID?: number

    @Field(type => Int, { nullable: true})
    pageoffset?: number

    @Field(type => Int, { nullable: true})
    pagenum?: number
}

@ArgsType()
export class CommentArgs {
    @Field(type => String)
    empID: string

    @Field(type => String, { nullable : true})
    comment?: string
}

@ArgsType()
export class AreaStatisticArgs {
    @Field(type=> String)
    areaSelectedDate: string
}

@ArgsType()
export class TotalStatisticArgs {
    @Field(type=> String)
    totalStatSelectedDate: string
}

@ArgsType()
export class AreaGraphArgs {
    @Field(type=> Int, { nullable : true})
    areaID: number

    @Field(type=> Int,  { nullable : true})
    locationID: number

    @Field(type=> Int,  { nullable : true})
    teamID: number
}

@ArgsType()
export class DateSelectArgs{
    @Field(type => String, { nullable: true})
    dateFrom?: string
}