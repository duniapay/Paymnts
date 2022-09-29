import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { LoginDTO, RegisterDTO } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Post('login')
  @ApiBody({
    required: true,
    description: 'Login',
    type: LoginDTO,
  })
  @ApiResponse({ status: 403, description: 'Not found' })
  @ApiResponse({
    status: 404,
    description: 'Failed',
  })
  async login(@Req() req, @Res() res, @Body() body) {
    const auth = await this.authService.login(body);
    res.status(auth.status).json(auth.msg);
  }

  @Post('register')
  @ApiBody({
    required: true,
    description: 'Register an account',
    type: RegisterDTO,
  })
  @ApiResponse({ status: 403, description: 'Not found' })
  @ApiResponse({
    status: 404,
    description: 'Failed',
  })
  async register(@Req() req, @Res() res, @Body() body) {
    const auth = await this.authService.register(body);
    res.status(auth.status).json(auth.content);
  }
}
