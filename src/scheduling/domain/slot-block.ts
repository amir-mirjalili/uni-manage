import { TimeInterval } from './time-interval';

export class SlotBlock {
  private _occupied: TimeInterval[] = [];

  constructor(
    public readonly day: number,
    public readonly dayStart: number,
    public readonly dayEnd: number,
  ) {}

  get duration(): number {
    return this.dayEnd - this.dayStart;
  }

  get occupied(): ReadonlyArray<TimeInterval> {
    return this._occupied;
  }

  getFreeIntervals(requiredDuration: number): TimeInterval[] {
    const result: TimeInterval[] = [];

    const occupied = this._occupied
      .map((o) => new TimeInterval(
        Math.max(o.start, this.dayStart),
        Math.min(o.end, this.dayEnd),
      ))
      .filter((o) => o.start < o.end)
      .sort((a, b) => a.start - b.start);

    const merged: TimeInterval[] = [];
    for (const cur of occupied) {
      if (
        merged.length === 0 ||
        merged[merged.length - 1].end < cur.start
      ) {
        merged.push(cur);
      } else {
        const last = merged[merged.length - 1];
        merged[merged.length - 1] = new TimeInterval(
          last.start,
          Math.max(last.end, cur.end),
        );
      }
    }

    let cursor = this.dayStart;

    for (const busy of merged) {
      if (busy.start - cursor >= requiredDuration) {
        result.push(new TimeInterval(cursor, busy.start));
      }
      cursor = Math.max(cursor, busy.end);
    }

    if (this.dayEnd - cursor >= requiredDuration) {
      result.push(new TimeInterval(cursor, this.dayEnd));
    }

    return result;
  }

  reserve(interval: TimeInterval): void {
    if (this._occupied.some((o) => o.overlaps(interval))) {
      throw new Error('Overlap');
    }

    this._occupied.push(interval);
  }

  clone(): SlotBlock {
    const c = new SlotBlock(this.day, this.dayStart, this.dayEnd);
    for (const o of this._occupied) {
      c._occupied.push(new TimeInterval(o.start, o.end));
    }
    return c;
  }

  toString(): string {
    return `Day ${this.day} | ${this.dayStart}-${this.dayEnd}`;
  }
}
