import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(user: User) {
    const expiresIn = 60 * 60;
    const secretOrKey = 'secret';
    const data = {
      id: user.id,
      username: user.username,
      team: user.team,
    };

    return jwt.sign(data, secretOrKey, { expiresIn });
    // return { expires_in: expiresIn, token };
  }

  async validateUser(signedUser): Promise<boolean> {
    if (signedUser && signedUser.username) {
      return Boolean(this.userService.getUserByUsername(signedUser.username));
    }

    return false;
  }
}