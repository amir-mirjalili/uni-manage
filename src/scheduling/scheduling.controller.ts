import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GenerateScheduleDto } from './dto/generate-schedule.dto';
import {
  SCHEDULE_GENERATION_QUEUE,
  ScheduleGenerationJobResult,
} from './jobs/schedule-generation.job';

@Controller('scheduling')
export class SchedulingController {
  constructor(
    @InjectQueue(SCHEDULE_GENERATION_QUEUE)
    private readonly scheduleQueue: Queue,
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generateSchedule(@Body() dto: GenerateScheduleDto) {
    const job = await this.scheduleQueue.add({
      studentGroupIds: dto.studentGroupIds,
      termNumber: dto.termNumber,
    });

    return {
      jobId: job.id,
      status: 'pending',
    };
  }

  @Get('jobs/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    const job = await this.scheduleQueue.getJob(Number(jobId));

    if (!job) {
      return {
        status: 'not_found',
      };
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue as ScheduleGenerationJobResult | undefined;
    const failedReason = job.failedReason;

    return {
      jobId: job.id,
      status: state,
      progress,
      result: state === 'completed' ? result : undefined,
      error: state === 'failed' ? failedReason : undefined,
    };
  }

  @Get('jobs/:jobId/result')
  async getJobResult(@Param('jobId') jobId: string) {
    const job = await this.scheduleQueue.getJob(Number(jobId));

    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();

    if (state !== 'completed') {
      throw new Error(`Job is not completed. Current status: ${state}`);
    }

    return job.returnvalue as ScheduleGenerationJobResult;
  }
}
