import { Chromosome } from '../domain/chromosome';

export class ScheduleValidator {
  static validate(ch: Chromosome): boolean {
    for (let i = 0; i < ch.genes.length; i++) {
      for (let j = i + 1; j < ch.genes.length; j++) {
        if (ch.genes[i].overlaps(ch.genes[j])) {
          return false;
        }
      }
    }
    return true;
  }
}
