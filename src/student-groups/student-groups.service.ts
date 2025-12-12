import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentGroup } from '../entities/student-group.entity';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';

@Injectable()
export class StudentGroupsService {
  constructor(
    @InjectRepository(StudentGroup)
    private readonly studentGroupRepository: Repository<StudentGroup>,
  ) {}

  async create(
    createStudentGroupDto: CreateStudentGroupDto,
  ): Promise<StudentGroup> {
    const studentGroup =
      this.studentGroupRepository.create(createStudentGroupDto);
    return await this.studentGroupRepository.save(studentGroup);
  }

  async findAll(): Promise<StudentGroup[]> {
    return await this.studentGroupRepository.find({
      relations: ['classSections'],
    });
  }

  async findOne(id: string): Promise<StudentGroup> {
    const studentGroup = await this.studentGroupRepository.findOne({
      where: { id },
      relations: ['classSections'],
    });

    if (!studentGroup) {
      throw new NotFoundException(`StudentGroup with ID ${id} not found`);
    }

    return studentGroup;
  }

  async update(
    id: string,
    updateStudentGroupDto: UpdateStudentGroupDto,
  ): Promise<StudentGroup> {
    const studentGroup = await this.findOne(id);
    Object.assign(studentGroup, updateStudentGroupDto);
    return await this.studentGroupRepository.save(studentGroup);
  }

  async remove(id: string): Promise<void> {
    const studentGroup = await this.findOne(id);
    await this.studentGroupRepository.remove(studentGroup);
  }
}

