export interface ScheduleGenerationJobData {
  studentGroupIds: string[];
  termNumber: number;
}

export interface ScheduleGenerationJobResult {
  sections: Array<{
    id: string;
    courseId: string;
    professorId: string | null;
    studentGroupId: string;
  }>;
  entries: Array<{
    id: string;
    sectionId: string;
    day: string;
    startTime: string;
    endTime: string;
  }>;
  fitness: number;
}

export const SCHEDULE_GENERATION_QUEUE = 'schedule-generation';
