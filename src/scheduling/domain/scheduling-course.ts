import { SlotBlock } from './slot-block';

export class SchedulingCourse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly duration: number,
    public readonly units: number,
    public readonly allowedBlocks: SlotBlock[],
    public readonly prerequisites: string[],
    public readonly priority: number,
    public readonly minSemester: number = 1,
  ) {}
}
