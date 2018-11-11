import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository, UpdateResult, JoinOptions} from 'typeorm';
import { Game } from './game.entity';
import { Question } from 'question/question.entity';
import { QuestionService } from 'question/question.service';
import { AnswerService } from 'answer/answer.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  async createGame(game: Game): Promise<Game> {
    return await this.gameRepository.save(game);
  }

  async getGameById(gameId: string): Promise<Game> {
    return (await this.gameRepository.findOne(gameId));
  }

  async toggleGame(game: Game): Promise<any> {
      await this.gameRepository.save(game);
      // return (await this.gameRepository.findOne(game.id));
  }

  async getExistingGame(): Promise<Game | boolean> {
    const game = await this.gameRepository.findOne({ where: { isActive: true } });
    console.log("game", game);
    if (game ) {
      // const recentGame = games[0];
      game.questions = await this.getQuestionsWithAnswersByGame(game);
      return game;
    }
    return false;
  }

  async getGameWithQuestions(gameId: string): Promise<Game> {
    console.log("gameId", gameId);
    const gameById = await this.gameRepository.findOne({ id: gameId });
    gameById.questions = await this.getQuestionsWithAnswersByGame(gameById);
    return gameById;
  }

  private async getQuestionsWithAnswersByGame(game: Game): Promise<Question[]> {
    const questionsForGame = await this.questionService.getQuestionsByGame(game);
    console.log("questionsForGame" , questionsForGame.length);

    const questionsWithAnswers = questionsForGame.map(async question => {
      const answers = await this.answerService.getAnswersByQuestion(question);
      question.answers = answers;
      delete question.game;
      return question;
    });

    return await Promise.all(questionsWithAnswers);
  }
}