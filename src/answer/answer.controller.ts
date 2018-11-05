import {
    Controller,
    Post,
    HttpStatus,
    Get,
    Response,
    Body,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';
import { getManager } from 'typeorm';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

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