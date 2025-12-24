import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await argon2.hash(registerDto.password);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    const token = this.generateToken(user.id, user.login, user.role);

    return {
      user: result,
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.login, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const { password, ...result } = user;
    const token = this.generateToken(user.id, user.login, user.role);

    return {
      user: result,
      access_token: token,
    };
  }

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findByLogin(login);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  generateToken(userId: string, login: string, role: string): string {
    const payload = { sub: userId, login, role };
    return this.jwtService.sign(payload);
  }
}

