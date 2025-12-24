import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
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

