import { Chromosome } from '../domain/chromosome';
import { ExpertContext } from './expert-context';

export interface IExpertRule {
  name: string;
  weight: number;
  applies(ch: Chromosome, ctx: ExpertContext): boolean;
}
