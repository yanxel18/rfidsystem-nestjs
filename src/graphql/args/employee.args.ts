import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, MaxLength, ValidateIf } from 'class-validator';

@ArgsType()
export class EmployeeBoardArgs {
  @Field({ nullable: true })
  readonly search?: string;

  @Field((type) => [Int], { nullable: 'items' })
  readonly areaID?: number[];

  @Field((type) => [Int], { nullable: 'items' })
  readonly teamID?: number[];

  @Field((type) => [Int], { nullable: 'items' })
  readonly locID?: number[];

  @Field((type) => [Int], { nullable: 'items' })
  readonly posID?: number[];

  @Field((type) => [Int], { nullable: 'items' })
  readonly divID?: number[];

  @Field((type) => Int, { nullable: true })
  readonly pageoffset?: number;

  @Field((type) => Int, { nullable: true })
  readonly pagenum?: number;

  @Field((type) => Int, { nullable: true })
  readonly order?: number;

  @Field((type) => [Int], { nullable: 'items' })
  readonly kakariID?: number[];
}

@ArgsType()
export class CommentArgs {
  @IsNotEmpty({ message: 'Employee ID must not be empty' })
  @MaxLength(36, { message: 'EmpID value is too long!' })
  @IsUUID('all', { each: true, message: 'EmpID is not a valid format!' })
  @Field((type) => String)
  readonly empID: string;

  @MaxLength(20, { message: 'Comments should not exceed 20 characters!' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => String, { nullable: true })
  readonly comment?: string;
}
