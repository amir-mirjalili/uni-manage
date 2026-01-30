import { Professor } from '../../entities/professor.entity';
import { SchedulingProfessor } from '../domain/scheduling-professor';
import { SlotBlock } from '../domain/slot-block';
import { TimeConverter } from '../utils/time-converter';
import { Days } from '../../enums/days.enum';

export class ProfessorMapper {
  static toSchedulingProfessor(
    professor: Professor,
    teachableCourseIds: string[],
  ): SchedulingProfessor {
    const availableSlots = this.convertAvailableSlots(
      professor.availableTimeSlots,
    );

    return new SchedulingProfessor(
      professor.id,
      professor.name,
      professor.maxUnits,
      professor.minUnits,
      teachableCourseIds,
      availableSlots,
    );
  }

  private static convertAvailableSlots(
    availableTimeSlots: Array<{
      day: Days;
      startTime: string;
      endTime: string;
    }> | null,
  ): SlotBlock[] {
    if (!availableTimeSlots || availableTimeSlots.length === 0) {
      return [];
    }

    return availableTimeSlots.map((slot) => {
      const day = TimeConverter.dayEnumToInt(slot.day);
      const dayStart = TimeConverter.timeStringToInt(slot.startTime);
      const dayEnd = TimeConverter.timeStringToInt(slot.endTime);

      return new SlotBlock(day, dayStart, dayEnd);
    });
  }
}
