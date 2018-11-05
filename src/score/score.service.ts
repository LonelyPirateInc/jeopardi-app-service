import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository} from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoreService {
    constructor(
        @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
    ) {}

    // async getScoresByGame(): Promise<Team[]> {
    //     return await this.teamRepository.find();
    // }

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