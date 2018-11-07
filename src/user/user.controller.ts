import {
  Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe,
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
}