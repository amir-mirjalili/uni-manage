import { Chromosome } from '../domain/chromosome';
import { Gene } from '../domain/gene';
import { SchedulingCourse } from '../domain/scheduling-course';
import { SlotBlock } from '../domain/slot-block';
import { TimeInterval } from '../domain/time-interval';

export class PopulationInitializer {
  private readonly rnd: () => number;

  constructor(seed: number = 42) {
    let state = seed;
    this.rnd = () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  }

  createRandom(courses: SchedulingCourse[]): Chromosome {
    const ch = new Chromosome();

    const ordered = [...courses].sort((a, b) => b.priority - a.priority);

    for (const course of ordered) {
      let semester: number;

      if (course.name.includes('Final Project')) {
        semester = 8;
      } else {
        semester = Math.floor(
          this.rnd() * (9 - course.minSemester) + course.minSemester,
        );
      }

      const candidates = course.allowedBlocks.flatMap((b) => {
        const maxStart = b.dayEnd - course.duration;
        if (maxStart < b.dayStart) {
          return [];
        }

        return Array.from(
          { length: maxStart - b.dayStart + 1 },
          (_, i) => {
            const start = b.dayStart + i;
            return new SlotBlock(b.day, start, start + course.duration);
          },
        );
      });

      const pick =
        candidates.length > 0
          ? candidates[Math.floor(this.rnd() * candidates.length)]
          : null;

      if (pick) {
        ch.genes.push(
          new Gene(
            course.id,
            pick,
            new TimeInterval(pick.dayStart, pick.dayEnd),
            semester,
          ),
        );
      }
    }

    return ch;
  }
}
