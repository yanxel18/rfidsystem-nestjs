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
export class OPosList {
  @Field((type) => Int)
  posID: number;

  @Field({ nullable: true })
  posName: string;
}

@ObjectType()
export class ODivList {
  @Field((type) => Int)
  divID: number;

  @Field({ nullable: true })
  divName: string;
}

@ObjectType()
export class OKakariList {
  @Field((type) => Int)
  kakariID: number;

  @Field({ nullable: true })
  kakariDesc: string;
}
@ObjectType()
export class OViewDropList {
  @Field((type) => [OAreaList], { nullable: true, defaultValue: [] })
  IAreaList: OAreaList[];

  @Field((type) => [OLocationList], { nullable: true, defaultValue: [] })
  ILocationList: OLocationList[];

  @Field((type) => [OTeamList], { nullable: true, defaultValue: [] })
  ITeamList: OTeamList[];

  @Field((type) => [OPosList], { nullable: true, defaultValue: [] })
  IPositionList: OPosList[];

  @Field((type) => [ODivList], { nullable: true, defaultValue: [] })
  IDivisionList: ODivList[];

  @Field((type) => [OKakariList], { nullable: true, defaultValue: [] })
  IKakariList: OKakariList[];
}

@ObjectType()
export class ODateSelect {
  @Field({ nullable: true })
  DateSelect: string;
}
