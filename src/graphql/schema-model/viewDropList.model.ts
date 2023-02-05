import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OAreaList {

    @Field((type) => Int)
    areaID: number;

    @Field({ nullable: true })
    areaDesc: string;
}

@ObjectType()
export class OLocationList {
    
    @Field((type) => Int)
    locID: number;

    @Field({ nullable: true })
    buildloc: string;
}

@ObjectType()
export class OTeamList {

    @Field((type) => Int)
    teamID: number;
  
    @Field({ nullable: true })
    teamName: string; 

}


@ObjectType()
export class OViewDropList {
    @Field((type) => [OAreaList], { nullable: true})
    IAreaList: OAreaList[]| []

    @Field((type) => [OLocationList], { nullable: true})
    ILocationList: OLocationList[]| []

    @Field((type) => [OTeamList], { nullable: true})
    ITeamList: OTeamList[] | []
}