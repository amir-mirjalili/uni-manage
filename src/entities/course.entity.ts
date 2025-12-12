import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CourseType } from '../enums/course-type.enum';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'int' })
  units: number;

  @Column({ type: 'int', name: 'theory_hours' })
  theoryHours: number;

  @Column({ type: 'int', name: 'practical_hours' })
  practicalHours: number;

  @Column({
    type: 'enum',
    enum: CourseType,
    name: 'course_type',
  })
  courseType: CourseType;

  @ManyToMany(() => Course, (course) => course.prerequisiteFor, {
    cascade: false,
  })
  @JoinTable({
    name: 'course_prerequisites',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'prerequisite_id', referencedColumnName: 'id' },
  })
  prerequisites: Course[];

  @ManyToMany(() => Course, (course) => course.coRequisiteFor, {
    cascade: false,
  })
  @JoinTable({
    name: 'course_corequisites',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'corequisite_id', referencedColumnName: 'id' },
  })
  coRequisites: Course[];

  // Inverse relations for prerequisites
  @ManyToMany(() => Course, (course) => course.prerequisites)
  prerequisiteFor: Course[];

  // Inverse relations for coRequisites
  @ManyToMany(() => Course, (course) => course.coRequisites)
  coRequisiteFor: Course[];
}

