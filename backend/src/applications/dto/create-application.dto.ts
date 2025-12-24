import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'Название курса (должен существовать в системе)',
    example: 'Основы программирования на Python',
  })
  @IsNotEmpty({ message: 'Название курса обязательно для заполнения' })
  @IsString()
  courseName: string;

  @ApiProperty({
    description: 'Желаемая дата начала обучения (формат: YYYY-MM-DD)',
    example: '2024-03-01',
  })
  @IsNotEmpty({ message: 'Дата начала обучения обязательна для заполнения' })
  @IsDateString({}, { message: 'Некорректный формат даты' })
  startDate: string;

  @ApiProperty({
    description: 'Способ оплаты курса',
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
  })
  @IsNotEmpty({ message: 'Способ оплаты обязателен для заполнения' })
  @IsEnum(PaymentMethod, { message: 'Некорректный способ оплаты' })
  paymentMethod: PaymentMethod;
}

