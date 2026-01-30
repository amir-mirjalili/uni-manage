import { IExpertRule } from '../i-expert-rule';
import { Chromosome } from '../../domain/chromosome';
import { ExpertContext } from '../expert-context';

export class CompactDayRule implements IExpertRule {
  name = 'Compact daily schedule';
  weight = 25;

  applies(ch: Chromosome, ctx: ExpertContext): boolean {
    const byDay = new Map<number, typeof ch.genes>();
    for (const g of ch.genes) {
      if (!byDay.has(g.block.day)) {
        byDay.set(g.block.day, []);
      }
      byDay.get(g.block.day)!.push(g);
    }

    for (const [day, genes] of byDay) {
      const slots = [...genes]
        .map((g) => g.block)
        .sort((a, b) => a.dayStart - b.dayStart);

      for (let i = 0; i < slots.length - 1; i++) {
        if (slots[i].dayEnd !== slots[i + 1].dayStart) {
          return false;
        }
      }
    }

    return true;
  }
}
