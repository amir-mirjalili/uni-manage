import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { SchedulingService } from '../scheduling.service';
import {
  ScheduleGenerationJobData,
  ScheduleGenerationJobResult,
  SCHEDULE_GENERATION_QUEUE,
} from './schedule-generation.job';

@Processor(SCHEDULE_GENERATION_QUEUE)
export class ScheduleGenerationProcessor {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Process()
  async handleScheduleGeneration(
    job: Job<ScheduleGenerationJobData>,
  ): Promise<ScheduleGenerationJobResult> {
    try {
      const result = await this.schedulingService.generateSchedule(
        job.data.studentGroupIds,
        job.data.termNumber,
      );

      return {
        sections: result.sections.map((s) => ({
          id: s.id,
          courseId: s.course.id,
          professorId: s.professor?.id || null,
          studentGroupId: s.studentGroup.id,
        })),
        entries: result.entries.map((e) => ({
          id: e.id,
          sectionId: e.section.id,
          day: e.day,
          startTime: e.startTime,
          endTime: e.endTime,
        })),
        fitness: result.fitness,
      };
    } catch (error) {
      throw error;
    }
  }
}
