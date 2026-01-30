import { Gene } from '../domain/gene';
import { SchedulingCourse } from '../domain/scheduling-course';

export class ExpertRule {
  static evaluate(gene: Gene, course: SchedulingCourse): number {
    let score = 0;

    const waste = gene.block.duration - course.duration;
    score -= waste * 10;

    score -= gene.block.dayStart;

    if (waste === 0) {
      score += 10;
    }

    return score;
  }
}
