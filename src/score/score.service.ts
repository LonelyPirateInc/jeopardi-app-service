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
        return await this.scoreRepository.find({ where: { gameId } });
    }
    // async getScoresByTeamAndGameId(teamId: string, gameId: string): Promise<Score> {
    //     return (await this.scoreRepository.find({where:  { teamId , gameId } }));
    // }
  async getScoresByTeamAndGameId(teamId: string, gameId: string): Promise<Score[]> {
      return (await this.scoreRepository.find({where:  { teamId , gameId } }));
  }

  // async createTeam(team: Team): Promise<Team> {
  //     return await this.teamRepository.save(team);
  // }

  // buildTeam(obj: any): Team {
  //     const team = new Team();
  //     team.name = obj.team.name;
  //     return team;
  // }

  // async getTeamById(teamId: string): Promise<Team | boolean>{
  //     const teamById = this.teamRepository.findOne(teamId);
  //     if (teamById) {
  //         return teamById;
  //     }
  //     return false;
  // }
}