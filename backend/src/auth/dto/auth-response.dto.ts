import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Логин пользователя',
    example: 'user123',
  })
  login: string;

  @ApiProperty({
    description: 'ФИО пользователя',
    example: 'Иванов Иван Иванович',
  })
  fullName: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '8(999)123-45-67',
  })
  phone: string;

  @ApiProperty({
    description: 'Email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Роль пользователя',
    example: 'USER',
    enum: ['USER', 'ADMIN'],
  })
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Данные пользователя',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'JWT токен для авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

