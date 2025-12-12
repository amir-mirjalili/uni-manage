import { IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateStudentGroupDto {
  @IsInt()
  @Min(1300)
  entryYear: number;

  @IsString()
  major: string;

  @IsInt()
  @Min(1)
  termNumber: number;

  @IsNumber()
  @Min(1)
  population: number;
}

