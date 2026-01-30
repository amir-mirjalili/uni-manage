import { Chromosome } from '../domain/chromosome';
import { ExpertContext } from './expert-context';
import { IExpertRule } from './i-expert-rule';

export class RuleEngine {
  public firedRules: string[] = [];

  evaluate(
    ch: Chromosome,
    ctx: ExpertContext,
    rules: IExpertRule[],
  ): number {
    let score = 0;
    this.firedRules = [];

    for (const rule of rules) {
      if (rule.applies(ch, ctx)) {
        score += rule.weight;
        this.firedRules.push(rule.name);
      }
    }

    return score;
  }
}
