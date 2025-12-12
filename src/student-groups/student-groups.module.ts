import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentGroupsService } from './student-groups.service';
import { StudentGroupsController } from './student-groups.controller';
import { StudentGroup } from '../entities/student-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentGroup])],
  controllers: [StudentGroupsController],
  providers: [StudentGroupsService],
  exports: [StudentGroupsService],
})
export class StudentGroupsModule {}

