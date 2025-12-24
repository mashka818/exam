import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Получить профиль текущего пользователя',
    description: 'Возвращает информацию о текущем авторизованном пользователе'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль пользователя',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Получить список всех пользователей',
    description: 'Возвращает список всех зарегистрированных пользователей (без паролей)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список пользователей',
    type: [UserResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  async findAll() {
    return this.usersService.findAll();
  }
}

