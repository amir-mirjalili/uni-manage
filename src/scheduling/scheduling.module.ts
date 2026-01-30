import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Course } from '../entities/course.entity';
import { Professor } from '../entities/professor.entity';
import { StudentGroup } from '../entities/student-group.entity';
import { ClassSection } from '../entities/class-section.entity';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { ScheduleGenerationProcessor } from './jobs/schedule-generation.processor';
import { SCHEDULE_GENERATION_QUEUE } from './jobs/schedule-generation.job';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Professor,
      StudentGroup,
      ClassSection,
      ScheduleEntry,
    ]),
    BullModule.registerQueue({
      name: SCHEDULE_GENERATION_QUEUE,
    }),
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService, ScheduleGenerationProcessor],
  exports: [SchedulingService],
})
export class SchedulingModule {}
