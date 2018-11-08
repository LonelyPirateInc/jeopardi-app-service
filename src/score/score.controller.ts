import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { Team } from '../team/team.entity';
import { TeamService } from '../team/team.service';

import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { getManager } from 'typeorm';
import { Answer } from '../answer/answer.entity';
import { Score } from './score.entity';

@Controller('score')
export class ScoreController {
    constructor(
        private readonly teamService: TeamService,
        private readonly userService: UserService,
    ) {}

    @Get()
    findAll(): Promise<Team[]> {
        return this.teamService.getTeams();
    }

    @Post('submit')
    @UsePipes(new ValidationPipe({ transform: true }))
     async create(@Response() res: any, @Body() answer: Answer) {
        try {
            return res.status(HttpStatus.OK).json({
                success: true,
                payload: res,
            });
            // console.log(res);
            // await getManager().transaction(async transactionalEntityManager => {
            //     const team = new Team();
            //     team.name = user.team.name;
            //     user.team = await transactionalEntityManager.save(team);
            //     user.password = await this.userService.getHash(user.password);
            //     const newUser = await transactionalEntityManager.save(user);
            //     delete newUser.password;
            //     return res.status(HttpStatus.OK).json({
            //         success: true,
            //         payload: newUser,
            //     });
            // });
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code,
            });
        }
    }
}