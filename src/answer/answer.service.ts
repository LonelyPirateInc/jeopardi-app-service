import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository} from 'typeorm';
import { Answer } from './answer.entity';
import { Question } from '../question/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  public buildAnswerForQuestion(answerData: any): Answer {
    const answer = new Answer();
    answer.answerText = answerData.answerText;
    answer.isCorrect = answerData.isCorrect;
    answer.point = answerData.point;
    return answer;
  }

  async getAnswersByQuestion(question: Question): Promise<Answer[]> {
    return (await this.answerRepository.find({where: {questionId: question.id}}));
  }

  //   async getTeams(): Promise<Team[]> {
  //     return await this.teamRepository.find();
  //   }

  //   async createTeam(team: Team): Promise<Team> {
  //     return await this.teamRepository.save(team);
  //   }

  //   buildTeam(obj: any): Team {
  //     const team = new Team();
  //     team.name = obj.team.name;
  //     return team;
  //   }

  //   async getTeamById(teamId: string): Promise<Team | boolean> {
  //     const teamById = this.teamRepository.findOne(teamId);
  //     if (teamById) {
  //       return teamById;
  //     }
  //     return false;
  //   }
}