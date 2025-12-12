import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ClassSection } from './class-section.entity';

@Entity('student_groups')
export class StudentGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'entry_year' })
  entryYear: number;

  @Column({ type: 'varchar', length: 255 })
  major: string;

  @Column({ type: 'int', name: 'term_number' })
  termNumber: number;

  @Column({ type: 'int' })
  population: number;

  @OneToMany(() => ClassSection, (classSection) => classSection.studentGroup)
  classSections: ClassSection[];
}

