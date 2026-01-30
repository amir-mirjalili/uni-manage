import { Chromosome } from '../domain/chromosome';
import { SchedulingCourse } from '../domain/scheduling-course';
import { SchedulingProfessor } from '../domain/scheduling-professor';
import * as solver from 'javascript-lp-solver';

type VariableKey = string;
type AssignmentResult = Map<{ courseId: string; professorId: string }, number>;

export class ProfessorAssignmentSolver {
  isFeasible(
    schedule: Chromosome,
    courses: SchedulingCourse[],
    professors: SchedulingProfessor[],
  ): boolean {
    try {
      const model = this.buildModel(schedule, courses, professors, false);
      const result = solver.Solve(model);
      return result.feasible === true;
    } catch {
      return false;
    }
  }

  solve(
    courses: SchedulingCourse[],
    professors: SchedulingProfessor[],
    schedule: Chromosome,
  ): AssignmentResult {
    const model = this.buildModel(schedule, courses, professors, true);
    const result = solver.Solve(model);

    if (!result.feasible) {
      throw new Error('No feasible solution');
    }

    const assignment = new Map<
      { courseId: string; professorId: string },
      number
    >();

    for (const course of courses) {
      for (const professor of professors) {
        if (!professor.canTeachCourseIds.includes(course.id)) {
          continue;
        }

        const varName = `x_${course.id}_${professor.id}`;
        const value = result[varName] || 0;
        assignment.set({ courseId: course.id, professorId: professor.id }, value);
      }
    }

    return assignment;
  }

  private buildModel(
    schedule: Chromosome,
    courses: SchedulingCourse[],
    professors: SchedulingProfessor[],
    optimize: boolean,
  ): solver.IModel {
    const model: solver.IModel = {
      optimize: optimize ? 'cost' : '',
      opType: 'min',
      constraints: {},
      variables: {},
      ints: {},
    };

    const variables: Map<string, string> = new Map();

    for (const course of courses) {
      for (const professor of professors) {
        const varName = `x_${course.id}_${professor.id}`;
        variables.set(`${course.id}_${professor.id}`, varName);
        model.variables[varName] = {};
        model.ints[varName] = 1;
      }
    }

    for (const course of courses) {
      const constraintName = `course_${course.id}`;
      model.constraints[constraintName] = { min: 1, max: 1 };

      for (const professor of professors) {
        const varName = variables.get(`${course.id}_${professor.id}`);
        if (varName) {
          model.variables[varName][constraintName] = 1;
        }
      }
    }

    for (const professor of professors) {
      for (const course of courses) {
        if (!professor.canTeachCourseIds.includes(course.id)) {
          const varName = variables.get(`${course.id}_${professor.id}`);
          if (varName) {
            model.constraints[`qual_${course.id}_${professor.id}`] = {};
            model.variables[varName][`qual_${course.id}_${professor.id}`] = 1;
            model.constraints[`qual_${course.id}_${professor.id}`].max = 0;
          }
        }
      }
    }

    for (const professor of professors) {
      for (let i = 0; i < schedule.genes.length; i++) {
        for (let j = i + 1; j < schedule.genes.length; j++) {
          const a = schedule.genes[i];
          const b = schedule.genes[j];

          const overlap =
            a.block.day === b.block.day &&
            a.block.dayStart < b.block.dayEnd &&
            b.block.dayStart < a.block.dayEnd;

          if (overlap) {
            const varNameA = variables.get(`${a.courseId}_${professor.id}`);
            const varNameB = variables.get(`${b.courseId}_${professor.id}`);

            if (varNameA && varNameB) {
              const constraintName = `overlap_${professor.id}_${i}_${j}`;
              model.constraints[constraintName] = { max: 1 };
              model.variables[varNameA][constraintName] = 1;
              model.variables[varNameB][constraintName] = 1;
            }
          }
        }
      }
    }

    for (const professor of professors) {
      const constraintName = `units_${professor.id}`;
      model.constraints[constraintName] = {
        min: professor.minUnits || 0,
        max: professor.maxUnits,
      };

      for (const course of courses) {
        const varName = variables.get(`${course.id}_${professor.id}`);
        if (varName) {
          if (!model.variables[varName][constraintName]) {
            model.variables[varName][constraintName] = 0;
          }
          model.variables[varName][constraintName] += course.units;
        }
      }
    }

    for (const gene of schedule.genes) {
      for (const professor of professors) {
        const available = professor.availableSlots.some(
          (s) =>
            s.day === gene.block.day &&
            s.dayStart <= gene.block.dayStart &&
            s.dayEnd >= gene.block.dayEnd,
        );

        if (!available) {
          const varName = variables.get(`${gene.courseId}_${professor.id}`);
          if (varName) {
            const constraintName = `avail_${gene.courseId}_${professor.id}`;
            model.constraints[constraintName] = {};
            model.variables[varName][constraintName] = 1;
            model.constraints[constraintName].max = 0;
          }
        }
      }
    }

    if (optimize) {
      for (const varName of Object.keys(model.variables)) {
        model.variables[varName].cost = 1;
      }
    }

    return model;
  }
}
