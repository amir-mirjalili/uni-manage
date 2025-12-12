import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSectionsService } from './class-sections.service';
import { ClassSectionsController } from './class-sections.controller';
import { ClassSection } from '../entities/class-section.entity';
import { Course } from '../entities/course.entity';
import { Professor } from '../entities/professor.entity';
import { StudentGroup } from '../entities/student-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassSection,
      Course,
      Professor,
      StudentGroup,
    ]),
  ],
  controllers: [ClassSectionsController],
  providers: [ClassSectionsService],
  exports: [ClassSectionsService],
})
export class ClassSectionsModule {}

