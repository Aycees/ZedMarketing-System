import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAccountDto } from './dto/login-account.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorator/public.decorator';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginAccountDto: loginAccountDto, @Response({ passthrough: true }) res: ExpressResponse) {
    const { access_token } = await this.authService.signIn(loginAccountDto.username, loginAccountDto.password);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Login successful' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  signOut(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: "Logout successful" };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.account;
  }
}
