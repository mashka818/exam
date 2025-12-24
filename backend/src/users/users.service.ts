import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    login: string;
    password: string;
    fullName: string;
    phone: string;
    email: string;
  }): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { login: data.login },
          { email: data.email },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.login === data.login) {
        throw new ConflictException('Пользователь с таким логином уже существует');
      }
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        role: UserRole.USER,
      },
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        fullName: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    return users;
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        login: true,
        fullName: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}

