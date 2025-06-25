/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
  async register(@Body() dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully', schema: { example: { accessToken: 'jwt_token' } } })
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    const result = await this.authService.login(dto);
    return { accessToken: result.access_token };
  }
}
