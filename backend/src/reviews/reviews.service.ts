import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
      },
      include: {
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

  async findAll(): Promise<Review[]> {
    return this.prisma.review.findMany({
      include: {
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

  async findLatest(limit: number): Promise<Review[]> {
    return this.prisma.review.findMany({
      take: limit,
      include: {
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

  async findByUserId(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
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

  async findOne(id: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
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

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    return review;
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('Вы можете редактировать только свои отзывы');
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
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

  async delete(id: string, userId: string, userRole: string): Promise<Review> {
    const review = await this.findOne(id);

    if (userRole !== 'ADMIN' && review.userId !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои отзывы');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
}

