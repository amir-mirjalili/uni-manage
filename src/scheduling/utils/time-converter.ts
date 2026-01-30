import { Days } from '../../enums/days.enum';

export class TimeConverter {
  static timeStringToInt(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }

  static intToTimeString(timeInt: number): string {
    const hours = Math.floor(timeInt);
    const minutes = Math.round((timeInt - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  static dayEnumToInt(day: Days): number {
    const dayMap: Record<Days, number> = {
      [Days.SATURDAY]: 0,
      [Days.SUNDAY]: 1,
      [Days.MONDAY]: 2,
      [Days.TUESDAY]: 3,
      [Days.WEDNESDAY]: 4,
      [Days.THURSDAY]: 5,
    };
    return dayMap[day];
  }

  static intToDayEnum(dayInt: number): Days {
    const intMap: Record<number, Days> = {
      0: Days.SATURDAY,
      1: Days.SUNDAY,
      2: Days.MONDAY,
      3: Days.TUESDAY,
      4: Days.WEDNESDAY,
      5: Days.THURSDAY,
    };
    return intMap[dayInt];
  }
}
