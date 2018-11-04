import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository} from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    ) {}

    async getTeams(): Promise<Game[]> {
        return await this.gameRepository.find();
    }

    async createTeam(team: Game): Promise<Game> {
        return await this.gameRepository.save(team);
    }

    buildTeam(obj: any): Game {
        const team = new Game();
        team.name = obj.team.name;
        return team;
    }

    async getTeamById(teamId: string): Promise<Game | boolean>{
        const teamById = this.gameRepository.findOne(teamId);
        if (teamById) {
            return teamById;
        }
        return false;
    }
}