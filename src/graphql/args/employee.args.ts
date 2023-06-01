import { ArgsType, Field, Int } from "@nestjs/graphql";
import {  IsNotEmpty } from "class-validator";

@ArgsType()
export class EmployeeBoardArgs {
    @Field({ nullable: true})
    search?: string

    @Field(type => Int, { nullable: true})
    areaID?: number

    @Field(type => Int, { nullable: true})
    teamID?: number

    @Field(type => Int, { nullable: true})
    locID?: number

    @Field(type => Int, { nullable: true})
    posID?: number

    @Field(type => Int, { nullable: true})
    divID?: number

    @Field(type => Int, { nullable: true})
    pageoffset?: number

    @Field(type => Int, { nullable: true})
    pagenum?: number

    @Field(type => Int, { nullable: true})
    order?: number
}
@ArgsType()
export class  CommentArgs { 
    @IsNotEmpty({message: "Employee ID must not be empty"})
    @Field(type => String)
    empID: string

    @Field(type => String, { nullable : true})
    comment?: string
}

