import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe, Param,
} from '@nestjs/common';
import { Team } from './team.entity';
import { TeamService } from './team.service';

import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { getManager } from 'typeorm';

@Controller('game')
export class GameController {
    constructor(
        private readonly teamService: TeamService,
        private readonly userService: UserService,
    ) {}

    @Get()
    findAll(): Promise<Team[]> {
        return this.teamService.getTeams();
    }

    @Post('create')
    @UsePipes(new ValidationPipe({ transform: true }))
    async registerTeam(@Response() res: any, @Body() name: string): Promise<Game> {
        try {
            await getManager().transaction(async transactionalEntityManager => {
                const team = new Team();
                team.name = user.team.name;
                user.team = await transactionalEntityManager.save(team);
                user.password = await this.userService.getHash(user.password);
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

    @Post('toggle/:gameId')
    @UsePipes(new ValidationPipe({ transform: true }))
    async toggleGame(@Response() res: any, @Param('gameId') gameId: string, @Body() isActive: boolean): Promise<boolean> {
        try {

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
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code,
            });
        }
    }
}