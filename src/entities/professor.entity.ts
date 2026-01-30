import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ProfessorType } from '../enums/professor-type.enum';
import { Days } from '../enums/days.enum';
import { ClassSection } from './class-section.entity';

@Entity('professors')
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ProfessorType,
  })
  type: ProfessorType;

  @Column({ type: 'int', name: 'min_units', nullable: true })
  minUnits: number | null;

  @Column({ type: 'int', name: 'max_units' })
  maxUnits: number;

  @Column({
    type: 'json',
    name: 'available_time_slots',
    nullable: true,
    comment: 'JSON structure: { day: Days, startTime: string, endTime: string }[]',
  })
  availableTimeSlots: Array<{
    day: Days;
    startTime: string;
    endTime: string;
  }> | null;

  @Column({
    type: 'simple-array',
    name: 'preferred_days',
    nullable: true,
  })
  preferredDays: Days[] | null;

  @Column({
    type: 'simple-array',
    name: 'teachable_course_ids',
    nullable: true,
    comment: 'Array of course IDs that this professor can teach',
  })
  teachableCourseIds: string[] | null;

  @OneToMany(() => ClassSection, (classSection) => classSection.professor)
  classSections: ClassSection[];
}

