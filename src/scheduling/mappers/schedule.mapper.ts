import { Chromosome } from '../domain/chromosome';
import { ClassSection } from '../../entities/class-section.entity';
import { ScheduleEntry } from '../../entities/schedule-entry.entity';
import { Course } from '../../entities/course.entity';
import { Professor } from '../../entities/professor.entity';
import { StudentGroup } from '../../entities/student-group.entity';
import { TimeConverter } from '../utils/time-converter';
import { Days } from '../../enums/days.enum';

type AssignmentMap = Map<
  { courseId: string; professorId: string },
  number
>;

export class ScheduleMapper {
  static toClassSectionsAndEntries(
    chromosome: Chromosome,
    courses: Map<string, Course>,
    professors: Map<string, Professor>,
    studentGroup: StudentGroup,
    assignments: AssignmentMap,
  ): { sections: ClassSection[]; entries: ScheduleEntry[] } {
    const sections: ClassSection[] = [];
    const entries: ScheduleEntry[] = [];

    for (const gene of chromosome.genes) {
      const course = courses.get(gene.courseId);
      if (!course) continue;

      const assignment = Array.from(assignments.entries()).find(
        ([key]) => key.courseId === gene.courseId && assignments.get(key) === 1,
      );

      const professor =
        assignment && professors.has(assignment[0].professorId)
          ? professors.get(assignment[0].professorId)!
          : null;

      const section = new ClassSection();
      section.course = course;
      section.professor = professor;
      section.studentGroup = studentGroup;
      section.isFixed = false;

      sections.push(section);

      const scheduleEntry = new ScheduleEntry();
      scheduleEntry.section = section;
      scheduleEntry.day = TimeConverter.intToDayEnum(gene.block.day);
      scheduleEntry.startTime = TimeConverter.intToTimeString(
        gene.block.dayStart,
      );
      scheduleEntry.endTime = TimeConverter.intToTimeString(gene.block.dayEnd);

      entries.push(scheduleEntry);
    }

    return { sections, entries };
  }
}
