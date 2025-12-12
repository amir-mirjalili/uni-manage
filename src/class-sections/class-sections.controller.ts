import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClassSectionsService } from './class-sections.service';
import { CreateClassSectionDto } from './dto/create-class-section.dto';
import { UpdateClassSectionDto } from './dto/update-class-section.dto';

@Controller('class-sections')
export class ClassSectionsController {
  constructor(
    private readonly classSectionsService: ClassSectionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClassSectionDto: CreateClassSectionDto) {
    return this.classSectionsService.create(createClassSectionDto);
  }

  @Get()
  findAll() {
    return this.classSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classSectionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassSectionDto: UpdateClassSectionDto,
  ) {
    return this.classSectionsService.update(id, updateClassSectionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.classSectionsService.remove(id);
  }
}

