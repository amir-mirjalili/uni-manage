import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CoursesModule } from "./courses/courses.module";
import { ProfessorsModule } from "./professors/professors.module";
import { StudentGroupsModule } from "./student-groups/student-groups.module";
import { ClassSectionsModule } from "./class-sections/class-sections.module";
import { ScheduleEntriesModule } from "./schedule-entries/schedule-entries.module";
import { Course } from "./entities/course.entity";
import { Professor } from "./entities/professor.entity";
import { StudentGroup } from "./entities/student-group.entity";
import { ClassSection } from "./entities/class-section.entity";
import { ScheduleEntry } from "./entities/schedule-entry.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_DATABASE", "university_scheduling"),
        entities: [
          Course,
          Professor,
          StudentGroup,
          ClassSection,
          ScheduleEntry,
        ],
        synchronize: configService.get("DB_SYNCHRONIZE", false), // Set to false in production
        logging: configService.get("DB_LOGGING", false),
      }),
      inject: [ConfigService],
    }),
    CoursesModule,
    ProfessorsModule,
    StudentGroupsModule,
    ClassSectionsModule,
    ScheduleEntriesModule,
  ],
})
export class AppModule {}
