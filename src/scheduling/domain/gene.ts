import { SlotBlock } from './slot-block';
import { TimeInterval } from './time-interval';

export class Gene {
  constructor(
    public readonly courseId: string,
    public block: SlotBlock,
    public occupiedTime: TimeInterval,
    public semester: number,
  ) {}

  overlaps(other: Gene): boolean {
    if (this.semester !== other.semester) return false;
    if (other == null) return false;
    if (this.block.day !== other.block.day) return false;

    return (
      this.occupiedTime.start < other.occupiedTime.end &&
      other.occupiedTime.start < this.occupiedTime.end
    );
  }

  clone(): Gene {
    return new Gene(
      this.courseId,
      this.block.clone(),
      this.occupiedTime.clone(),
      this.semester,
    );
  }
}
