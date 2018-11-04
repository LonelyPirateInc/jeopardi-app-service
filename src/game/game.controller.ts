import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe, Param,
} from '@nestjs/common';
import { Team } from '../team/team.entity';
import { TeamService } from '../team/team.service';

import { GameService } from '../game/game.service';
import { User } from '../user/user.entity';
import { getManager } from 'typeorm';
import { Game } from './game.entity';

@Controller('game')
export class GameController {
  constructor(
    private readonly teamService: TeamService,
    private readonly gameService: GameService,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async greateGame(@Response() res: any, @Body() game: Game): Promise<Game> {
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
  ): Promise<boolean> {
    try {
      const gameById = await this.gameService.getGameById(gameId);
      gameById.isActive = isActive;

      const updatedGame = await this.gameService.updateGame(gameById);
      return res.status(HttpStatus.OK).json({
        success: true,
        payload: updatedGame.isActive,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code,
      });
    }
  }
}