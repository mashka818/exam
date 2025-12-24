import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'user123',
  })
  @IsNotEmpty({ message: 'Логин обязателен для заполнения' })
  @IsString()
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @IsString()
  password: string;
}

