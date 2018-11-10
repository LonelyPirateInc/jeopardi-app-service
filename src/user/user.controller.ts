import {
  Controller, Post, HttpStatus, Get, Put, Response, Body, UsePipes, ValidationPipe,
} from '@nestjs/common';

import { getManager } from 'typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
// import { FacilityService } from 'facility/facility.service';
import { AuthToken } from '../auth/auth-token.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.getUsers();
  }


  @Post('register')
  async create(@Response() res: any, @Body() body: { username: string, role: string}) {
      if (!body.username) {
          return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username is required!' });
      }

      let user = await this.userService.getUserByUsername(body.username);

      if (user) {
          return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username exists' });
      } else {
          user = await this.userService.createUser(body.username);
          if (user) {
              user.password = undefined;
          }
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        payload: user,
      });
  }

  @Put('joinTeam')
  async putUserTeam(@Response() res: any, @Body() body: any) {
      if (!body.username) {
          return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username is missing!' });
      }
      await getManager().transaction(async transactionalEntityManager => {
        const user = await this.userService.getUserByUsername(body.username);
        user.team = body.teamId;
        const updatedUser = await transactionalEntityManager.save(User, user);
        return res.status(HttpStatus.OK).json({
          success: true,
          payload: updatedUser,
        });
      });
  }

}