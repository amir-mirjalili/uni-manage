import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntriesService } from './schedule-entries.service';
import { ScheduleEntriesController } from './schedule-entries.controller';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { ClassSection } from '../entities/class-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntry, ClassSection])],
  controllers: [ScheduleEntriesController],
  providers: [ScheduleEntriesService],
  exports: [ScheduleEntriesService],
})
export class ScheduleEntriesModule {}

