# University Course Scheduling System

A Nest.js backend application for managing university course scheduling with TypeORM.

## Project Structure

```
src/
├── entities/              # TypeORM entities
│   ├── course.entity.ts
│   ├── professor.entity.ts
│   ├── student-group.entity.ts
│   ├── class-section.entity.ts
│   ├── schedule-entry.entity.ts
│   └── index.ts
├── enums/                 # Enum definitions
│   ├── course-type.enum.ts
│   ├── professor-type.enum.ts
│   ├── days.enum.ts
│   └── index.ts
├── courses/               # Course module
│   ├── dto/
│   │   ├── create-course.dto.ts
│   │   └── update-course.dto.ts
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── courses.module.ts
├── professors/            # Professor module
│   ├── dto/
│   │   ├── create-professor.dto.ts
│   │   └── update-professor.dto.ts
│   ├── professors.controller.ts
│   ├── professors.service.ts
│   └── professors.module.ts
├── student-groups/        # StudentGroup module
│   ├── dto/
│   │   ├── create-student-group.dto.ts
│   │   └── update-student-group.dto.ts
│   ├── student-groups.controller.ts
│   ├── student-groups.service.ts
│   └── student-groups.module.ts
├── class-sections/        # ClassSection module
│   ├── dto/
│   │   ├── create-class-section.dto.ts
│   │   └── update-class-section.dto.ts
│   ├── class-sections.controller.ts
│   ├── class-sections.service.ts
│   └── class-sections.module.ts
├── schedule-entries/      # ScheduleEntry module
│   ├── dto/
│   │   ├── create-schedule-entry.dto.ts
│   │   └── update-schedule-entry.dto.ts
│   ├── schedule-entries.controller.ts
│   ├── schedule-entries.service.ts
│   └── schedule-entries.module.ts
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=university_scheduling
DB_SYNCHRONIZE=false
DB_LOGGING=false
PORT=3000
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Courses
- `POST /courses` - Create a course
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get a course by ID
- `PATCH /courses/:id` - Update a course
- `DELETE /courses/:id` - Delete a course

### Professors
- `POST /professors` - Create a professor
- `GET /professors` - Get all professors
- `GET /professors/:id` - Get a professor by ID
- `PATCH /professors/:id` - Update a professor
- `DELETE /professors/:id` - Delete a professor

### Student Groups
- `POST /student-groups` - Create a student group
- `GET /student-groups` - Get all student groups
- `GET /student-groups/:id` - Get a student group by ID
- `PATCH /student-groups/:id` - Update a student group
- `DELETE /student-groups/:id` - Delete a student group

### Class Sections
- `POST /class-sections` - Create a class section
- `GET /class-sections` - Get all class sections
- `GET /class-sections/:id` - Get a class section by ID
- `PATCH /class-sections/:id` - Update a class section
- `DELETE /class-sections/:id` - Delete a class section

### Schedule Entries
- `POST /schedule-entries` - Create a schedule entry
- `GET /schedule-entries` - Get all schedule entries
- `GET /schedule-entries/:id` - Get a schedule entry by ID
- `PATCH /schedule-entries/:id` - Update a schedule entry
- `DELETE /schedule-entries/:id` - Delete a schedule entry

## Features

- ✅ Module-based architecture following Nest.js best practices
- ✅ TypeORM entities with proper relationships
- ✅ DTOs with class-validator for request validation
- ✅ RESTful API endpoints
- ✅ Service layer for business logic
- ✅ Proper error handling with NotFoundException
- ✅ TypeScript support
- ✅ Global validation pipes

## Database Schema

See `SCHEMA_DOCUMENTATION.md` for detailed database schema information.

