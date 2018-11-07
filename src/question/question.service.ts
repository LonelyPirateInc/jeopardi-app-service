import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { Category } from 'category/category.entity';
import { Game } from 'game/game.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  public buildQuestionsForGame(questionsData: any, category: Category, game: Game): Question[] {
    return questionsData.map(questionData => {
      const question = new Question();
      question.questionText = questionData.questionText;
      question.difficulty = questionData.difficulty;
      question.category = category;
      question.game = game;

      return question;
    });
  }

  async getQuestionsByGame(game: Game): Promise<Question[]> {
    return (await this.questionRepository.find({ where: {gameId: game.id} }));
  }
}