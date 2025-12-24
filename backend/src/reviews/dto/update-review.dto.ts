import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Текст отзыва',
    example: 'Отличный курс! Все понятно объясняют, много практики.',
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    description: 'Оценка от 1 до 5',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Оценка должна быть целым числом' })
  @Min(1, { message: 'Минимальная оценка - 1' })
  @Max(5, { message: 'Максимальная оценка - 5' })
  rating?: number;
}

