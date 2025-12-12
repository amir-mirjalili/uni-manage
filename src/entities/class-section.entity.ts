import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Professor } from './professor.entity';
import { StudentGroup } from './student-group.entity';
import { ScheduleEntry } from './schedule-entry.entity';

@Entity('class_sections')
export class ClassSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Professor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'professor_id' })
  professor: Professor | null;

  @ManyToOne(() => StudentGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_group_id' })
  studentGroup: StudentGroup;

  @Column({ type: 'boolean', name: 'is_fixed', default: false })
  isFixed: boolean;

  @OneToMany(() => ScheduleEntry, (scheduleEntry) => scheduleEntry.section)
  scheduleEntries: ScheduleEntry[];
}

