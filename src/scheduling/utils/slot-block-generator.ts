import { SlotBlock } from '../domain/slot-block';

export class SlotBlockGenerator {
  static generate(baseSlots: SlotBlock[], requiredDuration: number): SlotBlock[] {
    const result: SlotBlock[] = [];

    const groupedByDay = new Map<number, SlotBlock[]>();
    for (const slot of baseSlots) {
      if (!groupedByDay.has(slot.day)) {
        groupedByDay.set(slot.day, []);
      }
      groupedByDay.get(slot.day)!.push(slot);
    }

    for (const [day, daySlots] of groupedByDay) {
      const ordered = [...daySlots].sort((a, b) => a.dayStart - b.dayStart);

      for (let i = 0; i < ordered.length; i++) {
        let total = 0;
        const start = ordered[i].dayStart;
        let lastEnd = ordered[i].dayEnd;

        for (let j = i; j < ordered.length; j++) {
          if (j > i && ordered[j].dayStart !== lastEnd) {
            break;
          }

          total += ordered[j].duration;
          lastEnd = ordered[j].dayEnd;
          if (total >= requiredDuration) {
            result.push(new SlotBlock(day, start, start + total));
          }
        }
      }
    }

    return result;
  }

  static createBaseWeeklySlots(
    dayStart: number = 8,
    dayEnd: number = 18,
  ): SlotBlock[] {
    const slots: SlotBlock[] = [];

    for (let day = 0; day < 6; day++) {
      slots.push(new SlotBlock(day, dayStart, dayEnd));
    }

    return slots;
  }
}
