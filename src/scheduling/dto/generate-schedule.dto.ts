import { IsArray, IsNumber, IsString } from 'class-validator';

export class GenerateScheduleDto {
  @IsArray()
  @IsString({ each: true })
  studentGroupIds: string[];

  @IsNumber()
  termNumber: number;
}
