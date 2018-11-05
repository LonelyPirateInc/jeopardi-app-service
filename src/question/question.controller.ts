import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { getManager } from 'typeorm';

@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
    ) {}

    // @Get()
    // findAll(): Promise<Team[]> {
    //     return this.teamService.getTeams();
    // }

    // @Post('register')
    // @UsePipes(new ValidationPipe({ transform: true }))
    // async registerTeam(@Response() res: any, @Body() user: User): Promise<User> {
    //     try {
    //         await getManager().transaction(async transactionalEntityManager => {
    //             const team = new Team();
    //             team.name = user.team.name;
    //             user.team = await transactionalEntityManager.save(team);
    //             user.password = await this.userService.getHash(user.password);
    //             const newUser = await transactionalEntityManager.save(user);
    //             delete newUser.password;
    //             return res.status(HttpStatus.OK).json({
    //                 success: true,
    //                 payload: newUser,
    //             });
    //         });
    //     } catch (error) {
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //             success: false,
    //             message: error.code,
    //         });
    //     }
    // }
}