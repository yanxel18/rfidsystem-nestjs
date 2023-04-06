import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OTotalStatistics {

    @Field((type) => Int, { nullable: true})
    workerInTotal: number| null;

    @Field((type) => Int, { nullable: true})
    workerAllTotal: number| null;

    @Field((type) => Float, { nullable: true})
    workerInPercentage: number| null;
}

@ObjectType()
export class OPerAreaStatistics {
    @Field({ nullable: true})
    bldgName: string | null;

    @Field({ nullable: true})
    actualProc: string | null;

    @Field((type) => Int, { nullable: true})
    workerInTotal: number | null;

    @Field((type) => Int, { nullable: true})
    workerTotal: number | null;

    @Field((type) => Float , { nullable: true})
    workerInPercent: number | null;

}

@ObjectType()
export class OPerAreaGraph {
    @Field({ nullable: true})
    DateSelect: string | null;

    @Field((type)=> Float, { nullable: true})
    WorkerRate: number | null;
}
