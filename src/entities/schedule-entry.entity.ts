import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Days } from '../enums/days.enum';
import { ClassSection } from './class-section.entity';

@Entity('schedule_entries')
@Unique(['section', 'day', 'startTime'])
export class ScheduleEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClassSection, (classSection) => classSection.scheduleEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section: ClassSection;

  @Column({
    type: 'enum',
    enum: Days,
  })
  day: Days;

  @Column({
    type: 'time',
    name: 'start_time',
    comment: 'Time format: HH:mm (08:00 to 20:00)',
  })
  startTime: string;

  @Column({
    type: 'time',
    name: 'end_time',
    comment: 'Time format: HH:mm (08:00 to 20:00)',
  })
  endTime: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  room: string | null;
}

