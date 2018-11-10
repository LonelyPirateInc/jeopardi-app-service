import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { Team } from './team.entity';
import { TeamService } from './team.service';

import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { getManager } from 'typeorm';

@Controller('team')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
        private readonly userService: UserService,
    ) {}

    @Get()
    async findAll(@Response() res: any): Promise<Team[]> {
        const teams = await this.teamService.getTeams();
        return res.status(HttpStatus.OK).json({
            success: true,
            payload: teams,
        });
    }

    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true }))
    async registerTeam(@Response() res: any, @Body() user: User): Promise<User> {
        try {
            await getManager().transaction(async transactionalEntityManager => {
                const team = new Team();
                team.name = user.team.name;
                const newUser = await transactionalEntityManager.save(user);
                delete newUser.password;
                return res.status(HttpStatus.OK).json({
                    success: true,
                    payload: newUser,
                });
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code,
            });
        }
    }
}