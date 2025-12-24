import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const existingCourse = await this.prisma.course.findUnique({
      where: { name: createCourseDto.name },
    });

    if (existingCourse) {
      throw new ConflictException('Курс с таким названием уже существует');
    }

    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Курс не найден');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    await this.findOne(id); 

    if (updateCourseDto.name) {
      const existingCourse = await this.prisma.course.findUnique({
        where: { name: updateCourseDto.name },
      });

      if (existingCourse && existingCourse.id !== id) {
        throw new ConflictException('Курс с таким названием уже существует');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async delete(id: string): Promise<Course> {
    await this.findOne(id); 

    return this.prisma.course.delete({
      where: { id },
    });
  }
}





