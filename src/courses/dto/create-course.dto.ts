import { IsString, IsNumber, IsEnum, IsArray, IsOptional, IsUUID, Min } from 'class-validator';
import { CourseType } from '../../enums/course-type.enum';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  units: number;

  @IsNumber()
  @Min(0)
  theoryHours: number;

  @IsNumber()
  @Min(0)
  practicalHours: number;

  @IsEnum(CourseType)
  courseType: CourseType;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  prerequisiteIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  coRequisiteIds?: string[];
}

