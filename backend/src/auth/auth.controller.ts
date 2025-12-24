import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Регистрация нового пользователя',
    description: 'Создает нового пользователя в системе. Пароль хешируется с использованием argon2.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Ошибка валидации данных' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Пользователь с таким логином или email уже существует' 
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Вход в систему',
    description: 'Аутентификация пользователя по логину и паролю. Возвращает JWT токен.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешная авторизация',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неверный логин или пароль' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

