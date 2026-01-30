import { IExpertRule } from '../i-expert-rule';
import { Chromosome } from '../../domain/chromosome';
import { ExpertContext } from '../expert-context';

export class AvoidLateSlotRule implements IExpertRule {
  name = 'Avoid late afternoon classes';
  weight = -20;

  applies(ch: Chromosome, ctx: ExpertContext): boolean {
    return ch.genes.some((g) => g.block.dayStart >= 14);
  }
}
