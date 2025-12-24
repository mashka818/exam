import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Application, ApplicationStatus } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createApplicationDto: CreateApplicationDto): Promise<Application> {
    // Поиск курса по названию
    const course = await this.prisma.course.findUnique({
      where: { name: createApplicationDto.courseName },
    });

    if (!course) {
      throw new BadRequestException(`Курс "${createApplicationDto.courseName}" не найден в системе`);
    }

    // Конвертация строки даты в DateTime
    const startDate = new Date(createApplicationDto.startDate);

    return this.prisma.application.create({
      data: {
        courseId: course.id,
        startDate,
        paymentMethod: createApplicationDto.paymentMethod,
        userId,
        status: ApplicationStatus.NEW,
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Application[]> {
    return this.prisma.application.findMany({
      include: {
        course: true,
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<Application[]> {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Заявка не найдена');
    }

    return application;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateApplicationStatusDto,
    userId: string,
    userRole: string,
  ): Promise<Application> {
    const application = await this.findOne(id);

    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Только администратор может изменять статус заявки');
    }

    return this.prisma.application.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            login: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string, userRole: string): Promise<Application> {
    const application = await this.findOne(id);

    if (userRole !== 'ADMIN' && application.userId !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои заявки');
    }

    return this.prisma.application.delete({
      where: { id },
    });
  }
}

