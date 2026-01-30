import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Professor } from '../entities/professor.entity';
import { StudentGroup } from '../entities/student-group.entity';
import { ClassSection } from '../entities/class-section.entity';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { GeneticAlgorithm } from './ga/genetic-algorithm';
import { ScheduleValidator } from './ga/schedule-validator';
import { ProfessorAssignmentSolver } from './ilp/professor-assignment-solver';
import { CourseMapper } from './mappers/course.mapper';
import { ProfessorMapper } from './mappers/professor.mapper';
import { ScheduleMapper } from './mappers/schedule.mapper';
import { SchedulingCourse } from './domain/scheduling-course';
import { SchedulingProfessor } from './domain/scheduling-professor';
import { SlotBlockGenerator } from './utils/slot-block-generator';
import { SlotBlock } from './domain/slot-block';

export interface ScheduleGenerationResult {
  sections: ClassSection[];
  entries: ScheduleEntry[];
  fitness: number;
}

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepository: Repository<StudentGroup>,
    @InjectRepository(ClassSection)
    private readonly classSectionRepository: Repository<ClassSection>,
    @InjectRepository(ScheduleEntry)
    private readonly scheduleEntryRepository: Repository<ScheduleEntry>,
  ) {}

  async generateSchedule(
    studentGroupIds: string[],
    termNumber: number,
  ): Promise<ScheduleGenerationResult> {
    const studentGroups = await this.studentGroupRepository.find({
      where: { id: In(studentGroupIds) },
    });

    if (studentGroups.length === 0) {
      throw new NotFoundException('No student groups found');
    }

    const courses = await this.courseRepository.find({
      relations: ['prerequisites', 'coRequisites'],
    });

    if (courses.length === 0) {
      throw new NotFoundException('No courses found');
    }

    const professors = await this.professorRepository.find();

    if (professors.length === 0) {
      throw new NotFoundException('No professors found');
    }

    const baseSlots = SlotBlockGenerator.createBaseWeeklySlots(8, 18);

    const schedulingCourses = courses.map((c) =>
      CourseMapper.toSchedulingCourse(c, baseSlots),
    );

    const schedulingProfessors = professors.map((p) =>
      ProfessorMapper.toSchedulingProfessor(
        p,
        p.teachableCourseIds || [],
      ),
    );

    const ga = new GeneticAlgorithm(schedulingCourses);
    const bestSchedule = ga.runHybrid(schedulingCourses, schedulingProfessors);

    if (!ScheduleValidator.validate(bestSchedule)) {
      throw new Error('Generated schedule is invalid (overlaps detected)');
    }

    const ilp = new ProfessorAssignmentSolver();
    const assignments = ilp.solve(
      schedulingCourses,
      schedulingProfessors,
      bestSchedule,
    );

    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const professorMap = new Map(professors.map((p) => [p.id, p]));

    const allSections: ClassSection[] = [];
    const allEntries: ScheduleEntry[] = [];

    for (const studentGroup of studentGroups) {
      const { sections, entries } = ScheduleMapper.toClassSectionsAndEntries(
        bestSchedule,
        courseMap,
        professorMap,
        studentGroup,
        assignments,
      );

      allSections.push(...sections);
      allEntries.push(...entries);
    }

    await this.classSectionRepository.save(allSections);
    await this.scheduleEntryRepository.save(allEntries);

    return {
      sections: allSections,
      entries: allEntries,
      fitness: bestSchedule.fitness,
    };
  }
}
