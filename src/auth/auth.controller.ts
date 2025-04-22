import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginAccountDto } from './dto/login-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() loginAccountDto: loginAccountDto) {
    return 'hello'
  }

  @Post('logout')
  signOut() {
    return "logout"
  }

}
