import { Chromosome } from '../domain/chromosome';
import { SchedulingCourse } from '../domain/scheduling-course';
import { SchedulingProfessor } from '../domain/scheduling-professor';
import { SlotBlock } from '../domain/slot-block';
import { PopulationInitializer } from './population-initializer';
import { FitnessEvaluator } from './fitness-evaluator';
import { RepairOperator } from './repair-operator';
import { FinalScheduleNormalizer } from './final-schedule-normalizer';
import { ProfessorAssignmentSolver } from '../ilp/professor-assignment-solver';

export class GeneticAlgorithm {
  private readonly populationSize = 20;
  private readonly generations = 40;
  private readonly rnd: () => number;
  private readonly init: PopulationInitializer;
  private readonly fitness: FitnessEvaluator;
  private readonly repair: RepairOperator;

  constructor(courses: SchedulingCourse[], seed: number = 42) {
    let state = seed;
    this.rnd = () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
    this.init = new PopulationInitializer(seed);
    this.fitness = new FitnessEvaluator(courses);
    this.repair = new RepairOperator(seed);
  }

  runHybrid(
    courses: SchedulingCourse[],
    professors: SchedulingProfessor[],
  ): Chromosome {
    const population: Chromosome[] = Array.from(
      { length: this.populationSize },
      () => this.init.createRandom(courses),
    );

    const ilp = new ProfessorAssignmentSolver();

    for (let gen = 0; gen < this.generations; gen++) {
      for (const ch of population) {
        this.repair.repair(ch, courses, professors);
        const ilpFeasible = ilp.isFeasible(ch, courses, professors);
        ch.fitness = this.fitness.evaluate(ch, courses, ilpFeasible);
      }

      const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
      const survivors = sorted.slice(0, this.populationSize / 2);
      const newPopulation = survivors.map((c) => c.clone());

      while (newPopulation.length < this.populationSize) {
        const p1 = newPopulation[Math.floor(this.rnd() * newPopulation.length)];
        const p2 = newPopulation[Math.floor(this.rnd() * newPopulation.length)];
        const child = this.crossover(p1, p2);
        this.mutate(child, courses);
        newPopulation.push(child);
      }

      population.length = 0;
      population.push(...newPopulation);
    }

    const best = [...population].sort((a, b) => b.fitness - a.fitness)[0];
    return FinalScheduleNormalizer.normalize(best, courses, professors);
  }

  private crossover(p1: Chromosome, p2: Chromosome): Chromosome {
    const point = Math.floor(this.rnd() * p1.genes.length);
    const ch = new Chromosome();

    for (let i = 0; i < p1.genes.length; i++) {
      ch.genes.push((i < point ? p1 : p2).genes[i].clone());
    }

    return ch;
  }

  private mutate(ch: Chromosome, courses: SchedulingCourse[]): void {
    const i = Math.floor(this.rnd() * ch.genes.length);
    const gene = ch.genes[i];
    const course = courses.find((c) => c.id === gene.courseId);
    if (!course) return;

    if (course.name.includes('Final Project')) {
      gene.semester = 8;
      return;
    }

    if (this.rnd() < 0.6) {
      const min = course.minSemester;
      const max = 8;

      const bias = Math.max(0, 5 - course.priority);

      const target = Math.floor(
        this.rnd() * (Math.min(max, min + bias + 1) - min) + min,
      );
      gene.semester = target;
    }

    if (this.rnd() < 0.4) {
      const candidates = course.allowedBlocks
        .filter((b) => b.duration >= course.duration)
        .map(
          (b) =>
            new SlotBlock(
              b.day,
              b.dayStart,
              b.dayStart + course.duration,
            ),
        );

      if (candidates.length > 0) {
        gene.block = candidates[Math.floor(this.rnd() * candidates.length)];
      }
    }
  }
}
