import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Уникальный логин пользователя (латиница и цифры, минимум 6 символов)',
    example: 'user123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Логин обязателен для заполнения' })
  @IsString()
  @MinLength(6, { message: 'Логин должен содержать минимум 6 символов' })
  @Matches(/^[a-zA-Z0-9]+$/, { 
    message: 'Логин должен содержать только латинские буквы и цифры' 
  })
  login: string;

  @ApiProperty({
    description: 'Пароль (минимум 8 символов)',
    example: 'password123',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @ApiProperty({
    description: 'ФИО пользователя (кириллица и пробелы)',
    example: 'Иванов Иван Иванович',
  })
  @IsNotEmpty({ message: 'ФИО обязательно для заполнения' })
  @IsString()
  @Matches(/^[а-яА-ЯёЁ\s]+$/, { 
    message: 'ФИО должно содержать только кириллицу и пробелы' 
  })
  fullName: string;

  @ApiProperty({
    description: 'Номер телефона в формате 8(XXX)XXX-XX-XX',
    example: '8(999)123-45-67',
  })
  @IsNotEmpty({ message: 'Телефон обязателен для заполнения' })
  @IsString()
  @Matches(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/, { 
    message: 'Телефон должен быть в формате 8(XXX)XXX-XX-XX' 
  })
  phone: string;

  @ApiProperty({
    description: 'Адрес электронной почты',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
}

