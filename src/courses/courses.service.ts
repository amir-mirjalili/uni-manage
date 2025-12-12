import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create({
      title: createCourseDto.title,
      code: createCourseDto.code,
      units: createCourseDto.units,
      theoryHours: createCourseDto.theoryHours,
      practicalHours: createCourseDto.practicalHours,
      courseType: createCourseDto.courseType,
    });

    if (createCourseDto.prerequisiteIds?.length) {
      course.prerequisites = await this.courseRepository.findBy({
        id: In(createCourseDto.prerequisiteIds),
      });
    }

    if (createCourseDto.coRequisiteIds?.length) {
      course.coRequisites = await this.courseRepository.findBy({
        id: In(createCourseDto.coRequisiteIds),
      });
    }

    return await this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['prerequisites', 'coRequisites'],
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['prerequisites', 'coRequisites'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    Object.assign(course, {
      title: updateCourseDto.title,
      code: updateCourseDto.code,
      units: updateCourseDto.units,
      theoryHours: updateCourseDto.theoryHours,
      practicalHours: updateCourseDto.practicalHours,
      courseType: updateCourseDto.courseType,
    });

    if (updateCourseDto.prerequisiteIds !== undefined) {
      course.prerequisites = updateCourseDto.prerequisiteIds.length
        ? await this.courseRepository.findBy({
            id: In(updateCourseDto.prerequisiteIds),
          })
        : [];
    }

    if (updateCourseDto.coRequisiteIds !== undefined) {
      course.coRequisites = updateCourseDto.coRequisiteIds.length
        ? await this.courseRepository.findBy({
            id: In(updateCourseDto.coRequisiteIds),
          })
        : [];
    }

    return await this.courseRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }
}

