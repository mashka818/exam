import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Название курса (уникальное)',
    example: 'Основы программирования на Python',
  })
  @IsNotEmpty({ message: 'Название курса обязательно для заполнения' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Преподаватель курса',
    example: 'Иванов Иван Иванович',
  })
  @IsNotEmpty({ message: 'Преподаватель обязателен для заполнения' })
  @IsString()
  teacher: string;

  @ApiProperty({
    description: 'Описание курса',
    example: 'Изучите основы Python: синтаксис, структуры данных, ООП и многое другое',
  })
  @IsNotEmpty({ message: 'Описание обязательно для заполнения' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL изображения курса',
    example: 'https://example.com/python.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}


