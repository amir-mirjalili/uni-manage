import { IExpertRule } from '../i-expert-rule';
import { Chromosome } from '../../domain/chromosome';
import { ExpertContext } from '../expert-context';

export class HeavyCourseMorningRule implements IExpertRule {
  name = 'Heavy courses prefer morning';
  weight = 30;

  applies(ch: Chromosome, ctx: ExpertContext): boolean {
    return ch.genes.some((g) => {
      const c = ctx.getCourse(g.courseId);
      return c && c.units >= 3 && g.block.dayStart <= 10;
    });
  }
}
