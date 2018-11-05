import {
    Controller,
    Post,
    HttpStatus,
    Get,
    Response,
    Body,
    UsePipes,
    ValidationPipe,
    Param,
} from '@nestjs/common';
// import { getConnection } from 'typeorm';

import { Team } from '../team/team.entity';
import { TeamService } from '../team/team.service';

import { GameService } from '../game/game.service';
import { User } from '../user/user.entity';
import { getManager } from 'typeorm';
import { Game } from './game.entity';
import { Answer } from 'answer/answer.entity';
import { Score } from 'score/score.entity';
import { ScoreService } from 'score/score.service';
import { Question } from 'question/question.entity';

@Controller('game')
export class GameController {
  constructor(
    private readonly teamService: TeamService,
    private readonly gameService: GameService,
    // private readonly scoreService: ScoreService,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createGame(@Response() res: any, @Body() game: Game): Promise<Game> {
    try {
      const newGame = await this.gameService.createGame(game);
      return res.status(HttpStatus.OK).json({
        success: true,
        payload: newGame,
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
  async toggleGame(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Game> {
    try {
      const gameById = await this.gameService.getGameById(gameId);
      if (gameById) {
        gameById.isActive = isActive;
        const updatedGame = await this.gameService.toggleGame(gameById);
        return res.status(HttpStatus.OK).json({
          success: true,
          payload: updatedGame,
        });
      } else {
        throw new Error('ER_NOT_FOUND');
      }
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  @Post('play/:gameId/:questionId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async playQuestion(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Param('questionId') questionId: string,
    @Body('answers') answers: Answer[],
    @Body('team') team: Team,
  ): Promise<boolean> {
    try {
      const gameById = await this.gameService.getGameById(gameId);

      const scores = answers.map(answer => {
        const score = new Score();
        score.point = answer.point;
        score.team = team;
        score.game = gameById;
        return score;
      });

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(scores);
        const questionIds = [];
        const questions = questionIds.map(async id => {
          const question = await transactionalEntityManager.findOne(Question, {id});
          question.isActive = false;
          return question;
        });

        await transactionalEntityManager.save(scores);

        return res.status(HttpStatus.OK).json({
          success: true,
          payload: questions,
        });
      });

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  @Get('scores/:gameId')
  async getScoresByGameId(
    @Response() res: any,
    @Param('gameId') gameId: string,
  ): Promise<Score[]> {
    try {
      const gameById = await this.gameService.getGameById(gameId);
      return res.status(HttpStatus.OK).json({
        success: true,
        payload: gameById.scores,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }
}