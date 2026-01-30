import { Chromosome } from '../domain/chromosome';
import { Gene } from '../domain/gene';
import { SchedulingCourse } from '../domain/scheduling-course';
import { SchedulingProfessor } from '../domain/scheduling-professor';
import { SlotBlock } from '../domain/slot-block';
import { TimeInterval } from '../domain/time-interval';

export class FinalScheduleNormalizer {
  static normalize(
    ch: Chromosome,
    courses: SchedulingCourse[],
    professors: SchedulingProfessor[],
  ): Chromosome {
    const result = new Chromosome();

    const orderedGenes = [...ch.genes].sort(
      (a, b) =>
        (courses.find((c) => c.id === b.courseId)?.duration || 0) -
        (courses.find((c) => c.id === a.courseId)?.duration || 0),
    );

    for (const gene of orderedGenes) {
      const course = courses.find((c) => c.id === gene.courseId);
      if (!course) continue;

      const professorsOfCourse = professors.filter((p) =>
        p.canTeachCourseIds.includes(course.id),
      );

      const candidatesPreProcess = course.allowedBlocks.flatMap((b) => {
        const max = b.dayEnd - course.duration;
        if (max < b.dayStart) {
          return [];
        }

        return Array.from({ length: max - b.dayStart + 1 }, (_, i) => {
          const start = b.dayStart + i;
          return new SlotBlock(b.day, start, start + course.duration);
        });
      });

      const candidates = candidatesPreProcess
        .sort((a, b) => a.day - b.day)
        .filter(
          (nb) =>
            !result.genes.some(
              (g) =>
                g.block.day === nb.day &&
                g.block.dayStart < nb.dayEnd &&
                nb.dayStart < g.block.dayEnd,
            ) &&
            professorsOfCourse.some((p) =>
              p.availableSlots.some(
                (s) =>
                  s.day === nb.day &&
                  s.dayStart <= nb.dayStart &&
                  s.dayEnd >= nb.dayEnd,
              ),
            ),
        );

      if (candidates.length === 0) {
        throw new Error(
          `Final normalization failed for Course ${gene.courseId}`,
        );
      }

      const chosen = candidates[0];

      result.genes.push(
        new Gene(
          gene.courseId,
          chosen,
          new TimeInterval(chosen.dayStart, chosen.dayEnd),
          gene.semester,
        ),
      );
    }

    return result;
  }
}
