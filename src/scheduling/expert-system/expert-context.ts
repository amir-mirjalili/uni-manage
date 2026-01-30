import { SchedulingCourse } from '../domain/scheduling-course';

export class ExpertContext {
  constructor(public readonly courses: SchedulingCourse[]) {}

  getCourse(id: string): SchedulingCourse | undefined {
    return this.courses.find((c) => c.id === id);
  }
}
