import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassSection } from '../entities/class-section.entity';
import { Course } from '../entities/course.entity';
import { Professor } from '../entities/professor.entity';
import { StudentGroup } from '../entities/student-group.entity';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';

@Injectable()
export class ClassSectionsService {
  constructor(
    @InjectRepository(ClassSection)
    private readonly classSectionRepository: Repository<ClassSection>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepository: Repository<StudentGroup>,
  ) {}

  async create(
    createClassSectionDto: CreateClassSectionDto,
  ): Promise<ClassSection> {
    const course = await this.courseRepository.findOne({
      where: { id: createClassSectionDto.courseId },
    });
    if (!course) {
      throw new NotFoundException(
        `Course with ID ${createClassSectionDto.courseId} not found`,
      );
    }

    const studentGroup = await this.studentGroupRepository.findOne({
      where: { id: createClassSectionDto.studentGroupId },
    });
    if (!studentGroup) {
      throw new NotFoundException(
        `StudentGroup with ID ${createClassSectionDto.studentGroupId} not found`,
      );
    }

    let professor: Professor | null = null;
    if (createClassSectionDto.professorId) {
      professor = await this.professorRepository.findOne({
        where: { id: createClassSectionDto.professorId },
      });
      if (!professor) {
        throw new NotFoundException(
          `Professor with ID ${createClassSectionDto.professorId} not found`,
        );
      }
    }

    const classSection = this.classSectionRepository.create({
      course,
      professor,
      studentGroup,
      isFixed: createClassSectionDto.isFixed ?? false,
    });

    return await this.classSectionRepository.save(classSection);
  }

  async findAll(): Promise<ClassSection[]> {
    return await this.classSectionRepository.find({
      relations: ['course', 'professor', 'studentGroup', 'scheduleEntries'],
    });
  }

  async findOne(id: string): Promise<ClassSection> {
    const classSection = await this.classSectionRepository.findOne({
      where: { id },
      relations: ['course', 'professor', 'studentGroup', 'scheduleEntries'],
    });

    if (!classSection) {
      throw new NotFoundException(`ClassSection with ID ${id} not found`);
    }

    return classSection;
  }

  async update(
    id: string,
    updateClassSectionDto: UpdateClassSectionDto,
  ): Promise<ClassSection> {
    const classSection = await this.findOne(id);

    if (updateClassSectionDto.courseId) {
      const course = await this.courseRepository.findOne({
        where: { id: updateClassSectionDto.courseId },
      });
      if (!course) {
        throw new NotFoundException(
          `Course with ID ${updateClassSectionDto.courseId} not found`,
        );
      }
      classSection.course = course;
    }

    if (updateClassSectionDto.studentGroupId) {
      const studentGroup = await this.studentGroupRepository.findOne({
        where: { id: updateClassSectionDto.studentGroupId },
      });
      if (!studentGroup) {
        throw new NotFoundException(
          `StudentGroup with ID ${updateClassSectionDto.studentGroupId} not found`,
        );
      }
      classSection.studentGroup = studentGroup;
    }

    if (updateClassSectionDto.professorId !== undefined) {
      if (updateClassSectionDto.professorId === null) {
        classSection.professor = null;
      } else {
        const professor = await this.professorRepository.findOne({
          where: { id: updateClassSectionDto.professorId },
        });
        if (!professor) {
          throw new NotFoundException(
            `Professor with ID ${updateClassSectionDto.professorId} not found`,
          );
        }
        classSection.professor = professor;
      }
    }

    if (updateClassSectionDto.isFixed !== undefined) {
      classSection.isFixed = updateClassSectionDto.isFixed;
    }

    return await this.classSectionRepository.save(classSection);
  }

  async remove(id: string): Promise<void> {
    const classSection = await this.findOne(id);
    await this.classSectionRepository.remove(classSection);
  }
}

