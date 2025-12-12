import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateClassSectionDto {
  @IsUUID('4')
  courseId: string;

  @IsUUID('4')
  @IsOptional()
  professorId?: string | null;

  @IsUUID('4')
  studentGroupId: string;

  @IsBoolean()
  @IsOptional()
  isFixed?: boolean;
}

