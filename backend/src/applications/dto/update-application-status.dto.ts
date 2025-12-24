import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Новый статус заявки',
    enum: ApplicationStatus,
    example: ApplicationStatus.IN_PROGRESS,
  })
  @IsNotEmpty({ message: 'Статус обязателен для заполнения' })
  @IsEnum(ApplicationStatus, { message: 'Некорректный статус заявки' })
  status: ApplicationStatus;
}

