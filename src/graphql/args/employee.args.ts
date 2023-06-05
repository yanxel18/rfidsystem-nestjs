import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, MaxLength, ValidateIf } from 'class-validator';

@ArgsType()
export class EmployeeBoardArgs {
  @Field({ nullable: true })
  search: string;

  @Field((type) => Int, { nullable: true })
  areaID: number;

  @Field((type) => Int, { nullable: true })
  teamID: number;

  @Field((type) => Int, { nullable: true })
  locID: number;

  @Field((type) => Int, { nullable: true })
  posID: number;

  @Field((type) => Int, { nullable: true })
  divID: number;

  @Field((type) => Int, { nullable: true })
  pageoffset: number;

  @Field((type) => Int, { nullable: true })
  pagenum: number;

  @Field((type) => Int, { nullable: true })
  order: number;
}
@ArgsType()
export class CommentArgs {
  @IsNotEmpty({ message: 'Employee ID must not be empty' })
  @MaxLength(36, { message: 'EmpID value is too long!' })
  @IsUUID('all', { each: true, message: 'EmpID is not a valid format!' })
  @Field((type) => String)
  empID: string;

  @MaxLength(20, { message: 'Comments should not exceed 20 characters!' })
  @ValidateIf((_object, value) => value !== null)
  @Field((type) => String, { nullable: true })
  comment: string;
}
