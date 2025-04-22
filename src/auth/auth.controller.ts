import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAccountDto } from './dto/login-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginAccountDto: loginAccountDto) {
    return this.authService.signIn(loginAccountDto.username, loginAccountDto.password)
  }

  @Post('logout')
  signOut() {
    return "logout"
  }

}
