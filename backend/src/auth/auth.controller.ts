import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAccountDto } from './dto/login-account.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginAccountDto: loginAccountDto) {
    return this.authService.signIn(loginAccountDto.username, loginAccountDto.password)
  }

  @Post('logout')
  signOut() {
    return "logout"
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.account;
  }
}
