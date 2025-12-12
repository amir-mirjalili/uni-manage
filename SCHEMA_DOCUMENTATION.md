# University Course Scheduling System - Database Schema

## Overview
This document describes the database schema for a University Course Scheduling System built with Nest.js and TypeORM.

## Enums

### CourseType
- `BASIC` - Basic courses
- `MAIN` - Main courses
- `SPECIALIZED` - Specialized courses
- `GENERAL` - General courses
- `ELECTIVE` - Elective courses

### ProfessorType
- `FACULTY_MEMBER` - Faculty members (require minimum units)
- `VISITING` - Visiting professors (hourly basis)

### Days
- `SATURDAY`
- `SUNDAY`
- `MONDAY`
- `TUESDAY`
- `WEDNESDAY`
- `THURSDAY`

## Entities

### 1. Course
Represents the curriculum/CPM (Course Program Matrix).

**Fields:**
- `id`: UUID (Primary Key)
- `title`: string - Course title
- `code`: string - Unique course code
- `units`: number - Credit units
- `theoryHours`: number - Theory hours
- `practicalHours`: number - Practical hours
- `courseType`: CourseType enum
- `prerequisites`: Many-to-Many relation to Course (self-referencing)
- `coRequisites`: Many-to-Many relation to Course (self-referencing)

**Relationships:**
- Self-referencing Many-to-Many for prerequisites
- Self-referencing Many-to-Many for co-requisites

### 2. Professor
Represents faculty members and visiting professors.

**Fields:**
- `id`: UUID (Primary Key)
- `name`: string - Professor name
- `type`: ProfessorType enum
- `minUnits`: number | null - Minimum obligated units (for FacultyMembers)
- `maxUnits`: number - Maximum units
- `availableTimeSlots`: JSON array - Specific days and times available for teaching
  - Format: `[{ day: Days, startTime: string, endTime: string }]`
- `preferredDays`: Days[] - Array of preferred days

**Relationships:**
- One-to-Many with ClassSection

### 3. StudentGroup
Represents the input demand for courses.

**Fields:**
- `id`: UUID (Primary Key)
- `entryYear`: number - Entry year (e.g., 1402)
- `major`: string - Major field of study
- `termNumber`: number - Term number (e.g., Term 3)
- `population`: number - Number of students (determines required sections)

**Relationships:**
- One-to-Many with ClassSection

### 4. ClassSection
Represents the actual class to be scheduled.

**Fields:**
- `id`: UUID (Primary Key)
- `course`: Relation to Course
- `professor`: Relation to Professor (Nullable - can be assigned later)
- `studentGroup`: Relation to StudentGroup
- `isFixed`: boolean - Indicates if manually edited/fixed by manager

**Relationships:**
- Many-to-One with Course
- Many-to-One with Professor (nullable)
- Many-to-One with StudentGroup
- One-to-Many with ScheduleEntry

### 5. ScheduleEntry
Represents the scheduled time slots for classes.

**Fields:**
- `id`: UUID (Primary Key)
- `section`: Relation to ClassSection
- `day`: Days enum
- `startTime`: Time - Start time (08:00 to 20:00 range)
- `endTime`: Time - End time (08:00 to 20:00 range)
- `room`: string | null - Optional room assignment

**Relationships:**
- Many-to-One with ClassSection

**Constraints:**
- Unique constraint on (`section`, `day`, `startTime`) to prevent double-booking

## Database Tables

The schema will create the following tables:
- `courses`
- `course_prerequisites` (junction table)
- `course_corequisites` (junction table)
- `professors`
- `student_groups`
- `class_sections`
- `schedule_entries`

## Usage Example

```typescript
import { Course, Professor, StudentGroup, ClassSection, ScheduleEntry } from './entities';
import { CourseType, ProfessorType, Days } from './enums';

// Example: Create a course with prerequisites
const course = new Course();
course.title = "Advanced Algorithms";
course.code = "CS401";
course.units = 3;
course.theoryHours = 2;
course.practicalHours = 2;
course.courseType = CourseType.SPECIALIZED;
```

## Notes

- All IDs use UUID for better distribution and security
- The `availableTimeSlots` in Professor is stored as JSON for flexibility
- The `preferredDays` uses TypeORM's `simple-array` type for efficient storage
- ScheduleEntry has a unique constraint to prevent scheduling conflicts
- Course prerequisites and co-requisites use separate junction tables for clarity

