import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({
    description: 'Название курса (уникальное)',
    example: 'Основы программирования на Python',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Преподаватель курса',
    example: 'Иванов Иван Иванович',
    required: false,
  })
  @IsOptional()
  @IsString()
  teacher?: string;

  @ApiProperty({
    description: 'Описание курса',
    example: 'Изучите основы Python: синтаксис, структуры данных, ООП и многое другое',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL изображения курса',
    example: 'https://example.com/python.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}

