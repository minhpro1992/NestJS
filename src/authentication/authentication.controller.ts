import { Controller, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { LocalStrategy } from './local.strategy';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    console.log('login:', request.user);
    const { user } = request;
    const cookie = await this.authenticationService.getCookieWithJWtToken(
      user.id,
    );
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    console.log('22: ', cookie);
    return { cookie };
    // return response.send(user);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Post('profile')
  async login(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
