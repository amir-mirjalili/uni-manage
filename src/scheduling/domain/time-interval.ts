export class TimeInterval {
  constructor(
    public readonly start: number,
    public readonly end: number,
  ) {}

  get duration(): number {
    return this.end - this.start;
  }

  clone(): TimeInterval {
    return new TimeInterval(this.start, this.end);
  }

  overlaps(other: TimeInterval): boolean {
    return this.start < other.end && other.start < this.end;
  }

  toString(): string {
    return `${this.start}-${this.end}`;
  }
}
