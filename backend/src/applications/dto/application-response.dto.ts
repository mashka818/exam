import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

class CourseDto {
  @ApiProperty({ description: 'ID курса' })
  id: string;

  @ApiProperty({ description: 'Название курса' })
  name: string;

  @ApiProperty({ description: 'Преподаватель' })
  teacher: string;

  @ApiProperty({ description: 'Описание курса' })
  description: string;

  @ApiProperty({ description: 'Изображение курса', required: false })
  image?: string;
}

export class ApplicationResponseDto {
  @ApiProperty({
    description: 'ID заявки',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID курса',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  courseId: string;

  @ApiProperty({
    description: 'Данные курса',
    type: CourseDto,
  })
  course: CourseDto;

  @ApiProperty({
    description: 'Дата начала обучения',
    example: '2024-03-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Способ оплаты',
    enum: ['CASH', 'PHONE_TRANSFER'],
    example: 'CASH',
  })
  paymentMethod: string;

  @ApiProperty({
    description: 'Статус заявки',
    enum: ['NEW', 'IN_PROGRESS', 'COMPLETED'],
    example: 'NEW',
  })
  status: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Данные пользователя',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

