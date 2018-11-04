import {
  Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe,
} from '@nestjs/common';

import { getManager } from 'typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserInvite } from './interfaces/invite.interface';
import { AuthService } from 'auth/auth.service';
// import { FacilityService } from 'facility/facility.service';
import { AuthToken } from 'auth/auth-token.entity';

@Controller('facility')
export class FacilityController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    // private readonly facilityService: FacilityService,
  ) { }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.getUsers();
  }

  // @Post('register')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async registerFacility(@Response() res: any, @Body() user: User): Promise<User> {
  //   try {
  //     await getManager().transaction(async transactionalEntityManager => {
  //       const newUser = this.userService.createUser(user);
  //       // const facility = new Facility();
  //       // facility.name = user.facility.name;
  //       // facility.streetNumber = user.facility.streetNumber;
  //       // facility.streetName = user.facility.streetName;
  //       // facility.stateProvince = user.facility.stateProvince;
  //       // facility.country = user.facility.country;
  //       // facility.email = user.facility.email;
  //       // user.facility = await transactionalEntityManager.save(facility);
  //       // user.password = await this.userService.getHash(user.password);

  //       // const newUser = await transactionalEntityManager.save(user);
  //       // delete newUser.password;
  //       // return res.status(HttpStatus.OK).json({
  //       //   success: true,
  //       //   payload: newUser,
  //       // });
  //     });
  //   } catch (error) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       success: false,
  //       message: error.code,
  //     });
  //   }
  // }

  // @Post('invite')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async inviteUser(@Response() res: any, @Body() userInvite: UserInvite): Promise<User> {
  //   try {
  //       const user = await this.userService.getUserByEmail(userInvite.email);
  //       const facility = await this.facilityService.getFacilityById(userInvite.facilityId);

  //       if (!facility) {
  //         return res.status(HttpStatus.BAD_REQUEST).json({
  //           success: false,
  //           message: 'ER_FACILITY_NOT_EXISTS',
  //         });
  //       }

  //       if (user) {
  //         return res.status(HttpStatus.BAD_REQUEST).json({
  //           success: false,
  //           message: 'ER_EMAIL_ALREADY_EXISTS',
  //         });
  //       }

  //       if (!user && facility) {
  //         //
  //       }
  //     // await getManager().transaction(async transactionalEntityManager => {
  //     //   const newUser = this.userService.createUser(user);

  //     //   // const facility = new Facility();
  //     //   // facility.name = user.facility.name;
  //     //   // facility.streetNumber = user.facility.streetNumber;
  //     //   // facility.streetName = user.facility.streetName;
  //     //   // facility.stateProvince = user.facility.stateProvince;
  //     //   // facility.country = user.facility.country;
  //     //   // facility.email = user.facility.email;
  //     //   // user.facility = await transactionalEntityManager.save(facility);
  //     //   // user.password = await this.userService.getHash(user.password);

  //     //   // const newUser = await transactionalEntityManager.save(user);
  //     //   // delete newUser.password;
  //     //   // return res.status(HttpStatus.OK).json({
  //     //   //   success: true,
  //     //   //   payload: newUser,
  //     //   // });
  //     // });
  //   } catch (error) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       success: false,
  //       message: error.code,
  //     });
  //   }
  // }
}