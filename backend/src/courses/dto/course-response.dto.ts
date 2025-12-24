import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({
    description: 'ID курса',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Название курса',
    example: 'Основы программирования на Python',
  })
  name: string;

  @ApiProperty({
    description: 'Преподаватель',
    example: 'Иванов Иван Иванович',
  })
  teacher: string;

  @ApiProperty({
    description: 'Описание курса',
    example: 'Изучите основы Python: синтаксис, структуры данных, ООП и многое другое',
  })
  description: string;

  @ApiProperty({
    description: 'URL изображения курса',
    example: 'https://example.com/python.jpg',
    required: false,
  })
  image?: string;

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


