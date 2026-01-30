import { Course } from '../../entities/course.entity';
import { SchedulingCourse } from '../domain/scheduling-course';
import { SlotBlock } from '../domain/slot-block';
import { SlotBlockGenerator } from '../utils/slot-block-generator';
import { CourseType } from '../../enums/course-type.enum';

export class CourseMapper {
  static toSchedulingCourse(
    course: Course,
    baseSlots: SlotBlock[],
  ): SchedulingCourse {
    const duration = course.theoryHours + course.practicalHours;
    const priority = this.calculatePriority(course.courseType);
    const minSemester = this.estimateMinSemester(course);

    const allowedBlocks = SlotBlockGenerator.generate(baseSlots, duration);

    const prerequisites = course.prerequisites
      ? course.prerequisites.map((p) => p.id)
      : [];

    return new SchedulingCourse(
      course.id,
      course.title,
      duration,
      course.units,
      allowedBlocks,
      prerequisites,
      priority,
      minSemester,
    );
  }

  private static calculatePriority(courseType: CourseType): number {
    const priorityMap: Record<CourseType, number> = {
      [CourseType.BASIC]: 8,
      [CourseType.MAIN]: 10,
      [CourseType.SPECIALIZED]: 9,
      [CourseType.GENERAL]: 7,
      [CourseType.ELECTIVE]: 6,
    };
    return priorityMap[courseType] || 5;
  }

  private static estimateMinSemester(course: Course): number {
    if (course.prerequisites && course.prerequisites.length > 0) {
      return 2;
    }
    return 1;
  }
}
