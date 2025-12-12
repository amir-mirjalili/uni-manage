import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleEntriesService } from './schedule-entries.service';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto';
import { UpdateScheduleEntryDto } from './dto/update-schedule-entry.dto';

@Controller('schedule-entries')
export class ScheduleEntriesController {
  constructor(
    private readonly scheduleEntriesService: ScheduleEntriesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createScheduleEntryDto: CreateScheduleEntryDto) {
    return this.scheduleEntriesService.create(createScheduleEntryDto);
  }

  @Get()
  findAll() {
    return this.scheduleEntriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleEntriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleEntryDto: UpdateScheduleEntryDto,
  ) {
    return this.scheduleEntriesService.update(id, updateScheduleEntryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.scheduleEntriesService.remove(id);
  }
}

