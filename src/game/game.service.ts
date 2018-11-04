import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository} from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>
  ) {}

  async createGame(game: Game): Promise<Game> {
    return await this.gameRepository.save(game);
  }

  async getGameById(gameId: string): Promise<Game> {
    return await this.gameRepository.findOne(gameId);
  }

    async updateGame(game: Game): Promise<Game> {
        const updatedGame = await this.gameRepository.save(game);
        console.log(updatedGame);
        return updatedGame;
    }
}