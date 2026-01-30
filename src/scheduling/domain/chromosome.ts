import { Gene } from './gene';

export class Chromosome {
  public genes: Gene[] = [];
  public fitness: number = 0;

  clone(): Chromosome {
    const c = new Chromosome();
    for (const g of this.genes) {
      c.genes.push(g.clone());
    }
    c.fitness = this.fitness;
    return c;
  }
}
