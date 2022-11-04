import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  public async getCookieWithJWtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = await this.jwtService.sign(payload);
    console.log('configService: ', this.configService);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )} `;
  }
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      // const isPasswordMatching = await bcrypt.compare(
      //   plainTextPassword,
      //   user.password,
      // );
      // console.log('login:', email, plainTextPassword, user);
      // if (!isPasswordMatching) {
      //   throw new BadRequestException('Password is incorrect');
      // }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new BadRequestException('Password is incorrect');
    }
  }
}
