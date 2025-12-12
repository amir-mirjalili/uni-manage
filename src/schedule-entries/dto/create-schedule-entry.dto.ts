import { IsUUID, IsEnum, IsString, IsOptional, Matches } from 'class-validator';
import { Days } from '../../enums/days.enum';

export class CreateScheduleEntryDto {
  @IsUUID('4')
  sectionId: string;

  @IsEnum(Days)
  day: Days;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:mm format (08:00 to 20:00)',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:mm format (08:00 to 20:00)',
  })
  endTime: string;

  @IsString()
  @IsOptional()
  room?: string | null;
}

