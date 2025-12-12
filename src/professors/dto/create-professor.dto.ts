import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProfessorType } from '../../enums/professor-type.enum';
import { Days } from '../../enums/days.enum';

class TimeSlotDto {
  @IsEnum(Days)
  day: Days;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class CreateProfessorDto {
  @IsString()
  name: string;

  @IsEnum(ProfessorType)
  type: ProfessorType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minUnits?: number | null;

  @IsNumber()
  @Min(0)
  maxUnits: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  @IsOptional()
  availableTimeSlots?: TimeSlotDto[] | null;

  @IsArray()
  @IsEnum(Days, { each: true })
  @IsOptional()
  preferredDays?: Days[] | null;
}

