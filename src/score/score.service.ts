import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository} from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
  ) {}

    async getScores(): Promise<Score[]> {
        return await this.scoreRepository.find();
    }

    async getScoresByGameId(gameId: string): Promise<Score[]> {
        return (await this.scoreRepository.createQueryBuilder('score')
          .leftJoinAndSelect('score.team', 'team')
          .where('score.gameId = :gameId', { gameId })
          .getMany()
        );
    }

    async getScoresByTeamAndGameId(teamId: string, gameId: string): Promise<Score[]> {
        return (await this.scoreRepository.createQueryBuilder('score')
          .where('score.gameId = :gameId', { gameId })
          .andWhere('score.teamId = :teamId', { teamId })
          .getMany()
        );
    }
}
