import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository, UpdateResult} from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async createGame(game: Game): Promise<Game> {
    return await this.gameRepository.save(game);
  }

  async getGameById(gameId: string): Promise<Game> {
    return (await this.gameRepository.findOne(gameId));
  }

    async toggleGame(game: Game): Promise<Game> {
        await this.gameRepository.save(game);
        return await this.gameRepository.findOne(game.id);
    }
}