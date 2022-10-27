import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import { createHash } from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    const checkHash = await this.check(user.password, password);
    if (user && checkHash) {
      const { password, ...result } = user;
      return result;
    }
    throw new AuthenticationError('Wrong password.');
  }

  private async check(digest: string, plaintext: string): Promise<boolean> {
    const hash = createHash(process.env.HASHING_ALG)
      .update(plaintext)
      .digest('base64');
    return digest === hash;
  }

  async login(user: any) {
    const payload = user;
    return this.jwtService.sign(payload);
  }

  async refreshToken(token: string) {
    const { uuid, name, email, type, groupUuid } = this.jwtService.decode(
      token,
    ) as any;
    return this.jwtService.sign({ uuid, name, email, type, groupUuid });
  }
}
