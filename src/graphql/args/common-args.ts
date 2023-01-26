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
