import { SlotBlock } from './slot-block';

export class SchedulingProfessor {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly maxUnits: number,
    public readonly minUnits: number | null,
    public readonly canTeachCourseIds: string[],
    public readonly availableSlots: SlotBlock[],
  ) {}
}
