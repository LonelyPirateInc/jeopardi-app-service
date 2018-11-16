import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { Category } from 'category/category.entity';
import { Game } from 'game/game.entity';
import { AnswerService } from 'answer/answer.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly answerService: AnswerService,
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

  async getQuestionById(questionId: string): Promise<Question> {
    const question = await this.questionRepository.findOne(questionId);
    question.answers = await this.answerService.getAnswersByQuestion(question);
    return question;
  }

  async getQuestionsByGame(game: Game): Promise<Question[]> {
    return (await this.questionRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.category', 'category')
      .where('question.game_id = :game_id', {game_id: game.id})
      .getMany()
    );
  }

  async toggleQuestion(question: Question): Promise<Question> {
    await this.questionRepository.update(question.id, { isActive: question.isActive });
    return await this.questionRepository.findOne(question.id);
  }

  async getCurrentQuestion(): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { isCurrent: true } }));
    question.answers = await this.answerService.getAnswersByQuestion(question);
    return question;
  }


}