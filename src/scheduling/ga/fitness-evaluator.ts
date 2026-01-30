import { Chromosome } from '../domain/chromosome';
import { SchedulingCourse } from '../domain/scheduling-course';
import { ExpertRule } from './expert-rule';
import { RuleEngine } from '../expert-system/rule-engine';
import { ExpertContext } from '../expert-system/expert-context';
import { IExpertRule } from '../expert-system/i-expert-rule';
import { HeavyCourseMorningRule } from '../expert-system/rules/heavy-course-morning-rule';
import { AvoidLateSlotRule } from '../expert-system/rules/avoid-late-slot-rule';
import { CompactDayRule } from '../expert-system/rules/compact-day-rule';

export class FitnessEvaluator {
  private readonly engine: RuleEngine = new RuleEngine();
  private readonly rules: IExpertRule[];
  private readonly ctx: ExpertContext;

  constructor(courses: SchedulingCourse[]) {
    this.ctx = new ExpertContext(courses);
    this.rules = [
      new HeavyCourseMorningRule(),
      new AvoidLateSlotRule(),
      new CompactDayRule(),
    ];
  }

  evaluate(
    ch: Chromosome,
    courses: SchedulingCourse[],
    ilpFeasible: boolean,
  ): number {
    let fitness = 1000;

    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const geneMap = new Map(ch.genes.map((g) => [g.courseId, g]));

    const bySemester = new Map<number, typeof ch.genes>();
    for (const g of ch.genes) {
      if (!bySemester.has(g.semester)) {
        bySemester.set(g.semester, []);
      }
      bySemester.get(g.semester)!.push(g);
    }

    for (const [semester, genes] of bySemester) {
      const units = genes.reduce(
        (sum, g) => sum + (courseMap.get(g.courseId)?.units || 0),
        0,
      );

      if (units > 20) {
        fitness -= (units - 20) * 40;
      }
    }

    for (const g of ch.genes) {
      const c = courseMap.get(g.courseId);
      if (!c) continue;

      if (g.semester < c.minSemester) {
        fitness -= 150;
      }

      if (g.semester < 1 || g.semester > 8) {
        fitness -= 300;
      }

      for (const pre of c.prerequisites) {
        const prereqGene = geneMap.get(pre);
        if (!prereqGene) continue;

        if (prereqGene.semester >= g.semester) {
          fitness -= 200;
        }
      }

      if (c.name.includes('Final Project') && g.semester !== 8) {
        fitness -= 500;
      }

      fitness += (8 - g.semester) * c.priority * 2;
    }

    for (const g of ch.genes) {
      const c = courseMap.get(g.courseId);
      if (c) {
        fitness += ExpertRule.evaluate(g, c);
      }
    }

    fitness += Math.floor(this.engine.evaluate(ch, this.ctx, this.rules));

    fitness += ilpFeasible ? 600 : -600;

    return Math.max(0, fitness);
  }
}
