import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from '../entities/professor.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    const professor = this.professorRepository.create(createProfessorDto);
    return await this.professorRepository.save(professor);
  }

  async findAll(): Promise<Professor[]> {
    return await this.professorRepository.find({
      relations: ['classSections'],
    });
  }

  async findOne(id: string): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id },
      relations: ['classSections'],
    });

    if (!professor) {
      throw new NotFoundException(`Professor with ID ${id} not found`);
    }

    return professor;
  }

  async update(
    id: string,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<Professor> {
    const professor = await this.findOne(id);
    Object.assign(professor, updateProfessorDto);
    return await this.professorRepository.save(professor);
  }

  async remove(id: string): Promise<void> {
    const professor = await this.findOne(id);
    await this.professorRepository.remove(professor);
  }
}

