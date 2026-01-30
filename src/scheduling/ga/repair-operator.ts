import { Chromosome } from '../domain/chromosome';
import { Gene } from '../domain/gene';
import { SchedulingCourse } from '../domain/scheduling-course';
import { SchedulingProfessor } from '../domain/scheduling-professor';
import { SlotBlock } from '../domain/slot-block';
import { TimeInterval } from '../domain/time-interval';

export class RepairOperator {
  private readonly rnd: () => number;

  constructor(seed: number = 42) {
    let state = seed;
    this.rnd = () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  }

  repair(
    ch: Chromosome,
    courses: SchedulingCourse[],
    professors: SchedulingProfessor[],
  ): void {
    for (let i = 0; i < ch.genes.length; i++) {
      const gene = ch.genes[i];
      const course = courses.find((c) => c.id === gene.courseId);
      if (!course) continue;

      const professorsOfCourse = professors.filter((p) =>
        p.canTeachCourseIds.includes(course.id),
      );

      if (course.prerequisites.length > 0) {
        const minSemester =
          Math.max(
            ...course.prerequisites
              .map((p) => {
                const prereqGene = ch.genes.find((g) => g.courseId === p);
                return prereqGene ? prereqGene.semester : 1;
              })
              .concat([1]),
          ) + 1;

        if (gene.semester < minSemester) {
          gene.semester = minSemester;
        }
      }

      let guard = 0;
      while (this.hasOverlap(ch, gene)) {
        guard++;
        if (guard > 200) {
          break;
        }

        const options = this.generateCandidateBlocks(
          course,
          ch,
          gene,
          professorsOfCourse,
        );

        if (options.length === 0) {
          break;
        }

        gene.block = options[Math.floor(this.rnd() * options.length)];
        gene.occupiedTime = new TimeInterval(
          gene.block.dayStart,
          gene.block.dayEnd,
        );
      }
    }
  }

  private hasOverlap(ch: Chromosome, gene: Gene): boolean {
    return ch.genes.some(
      (g) =>
        g !== gene &&
        g.block.day === gene.block.day &&
        g.semester === gene.semester &&
        g.occupiedTime.start < gene.block.dayEnd &&
        gene.block.dayStart < g.occupiedTime.end,
    );
  }

  private generateCandidateBlocks(
    course: SchedulingCourse,
    ch: Chromosome,
    gene: Gene,
    professorsOfCourse: SchedulingProfessor[],
  ): SlotBlock[] {
    return course.allowedBlocks
      .flatMap((b) => {
        const max = b.dayEnd - course.duration;
        if (max < b.dayStart) {
          return [];
        }

        return Array.from({ length: max - b.dayStart + 1 }, (_, i) => {
          const start = b.dayStart + i;
          return new SlotBlock(b.day, start, start + course.duration);
        });
      })
      .filter(
        (nb) =>
          !ch.genes.some(
            (o) =>
              o !== gene &&
              o.block.day === nb.day &&
              o.occupiedTime.start < nb.dayEnd &&
              nb.dayStart < o.occupiedTime.end,
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
  }
}
