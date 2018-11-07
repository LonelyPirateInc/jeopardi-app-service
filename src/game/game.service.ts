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

  async toggleGame(game: Game): Promise<Game> {
      await this.gameRepository.save(game);
      return (await this.gameRepository.findOne(game.id));
  }

  async getExistingGame(): Promise<Game> {
    const games = await this.gameRepository.find({ order: { createdAt: 'DESC' } });
    return games[0];
  }

  async getGameWithQuestions(gameId: string): Promise<Game> {
    const gameById = await this.gameRepository.findOne({ id: gameId });
    const questionsForGame = await this.questionService.getQuestionsByGame(gameById);

    const questionsWithAnswers = questionsForGame.map(async question => {
      const answers = await this.answerService.getAnswersByQuestion(question);
      question.answers = answers;
      delete question.game;
      return question;
    });

    const awaitQuestionsWithAnswers = await Promise.all(questionsWithAnswers);
    gameById.questions = awaitQuestionsWithAnswers;
    return gameById;
  }
}