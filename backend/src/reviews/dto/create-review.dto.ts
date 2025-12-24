import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Текст отзыва',
    example: 'Отличный курс! Все понятно объясняют, много практики.',
  })
  @IsNotEmpty({ message: 'Текст отзыва обязателен для заполнения' })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Оценка от 1 до 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty({ message: 'Оценка обязательна для заполнения' })
  @IsInt({ message: 'Оценка должна быть целым числом' })
  @Min(1, { message: 'Минимальная оценка - 1' })
  @Max(5, { message: 'Максимальная оценка - 5' })
  rating: number;
}

