import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { ClassSection } from '../entities/class-section.entity';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto';
import { UpdateScheduleEntryDto } from './dto/update-schedule-entry.dto';

@Injectable()
export class ScheduleEntriesService {
  constructor(
    @InjectRepository(ScheduleEntry)
    private readonly scheduleEntryRepository: Repository<ScheduleEntry>,
    @InjectRepository(ClassSection)
    private readonly classSectionRepository: Repository<ClassSection>,
  ) {}

  async create(
    createScheduleEntryDto: CreateScheduleEntryDto,
  ): Promise<ScheduleEntry> {
    const section = await this.classSectionRepository.findOne({
      where: { id: createScheduleEntryDto.sectionId },
    });

    if (!section) {
      throw new NotFoundException(
        `ClassSection with ID ${createScheduleEntryDto.sectionId} not found`,
      );
    }

    // Check for conflicts (same section, day, and startTime)
    const existing = await this.scheduleEntryRepository.findOne({
      where: {
        section: { id: createScheduleEntryDto.sectionId },
        day: createScheduleEntryDto.day,
        startTime: createScheduleEntryDto.startTime,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Schedule entry already exists for this section, day, and start time',
      );
    }

    const scheduleEntry = this.scheduleEntryRepository.create({
      section,
      day: createScheduleEntryDto.day,
      startTime: createScheduleEntryDto.startTime,
      endTime: createScheduleEntryDto.endTime,
      room: createScheduleEntryDto.room ?? null,
    });

    return await this.scheduleEntryRepository.save(scheduleEntry);
  }

  async findAll(): Promise<ScheduleEntry[]> {
    return await this.scheduleEntryRepository.find({
      relations: ['section', 'section.course', 'section.professor'],
    });
  }

  async findOne(id: string): Promise<ScheduleEntry> {
    const scheduleEntry = await this.scheduleEntryRepository.findOne({
      where: { id },
      relations: ['section', 'section.course', 'section.professor'],
    });

    if (!scheduleEntry) {
      throw new NotFoundException(
        `ScheduleEntry with ID ${id} not found`,
      );
    }

    return scheduleEntry;
  }

  async update(
    id: string,
    updateScheduleEntryDto: UpdateScheduleEntryDto,
  ): Promise<ScheduleEntry> {
    const scheduleEntry = await this.findOne(id);

    if (updateScheduleEntryDto.sectionId) {
      const section = await this.classSectionRepository.findOne({
        where: { id: updateScheduleEntryDto.sectionId },
      });
      if (!section) {
        throw new NotFoundException(
          `ClassSection with ID ${updateScheduleEntryDto.sectionId} not found`,
        );
      }
      scheduleEntry.section = section;
    }

    if (updateScheduleEntryDto.day !== undefined) {
      scheduleEntry.day = updateScheduleEntryDto.day;
    }

    if (updateScheduleEntryDto.startTime !== undefined) {
      scheduleEntry.startTime = updateScheduleEntryDto.startTime;
    }

    if (updateScheduleEntryDto.endTime !== undefined) {
      scheduleEntry.endTime = updateScheduleEntryDto.endTime;
    }

    if (updateScheduleEntryDto.room !== undefined) {
      scheduleEntry.room = updateScheduleEntryDto.room;
    }

    return await this.scheduleEntryRepository.save(scheduleEntry);
  }

  async remove(id: string): Promise<void> {
    const scheduleEntry = await this.findOne(id);
    await this.scheduleEntryRepository.remove(scheduleEntry);
  }
}

