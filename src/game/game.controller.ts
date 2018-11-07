import {
    Controller,
    Post,
    HttpStatus,
    Get,
    Response,
    Body,
    UsePipes,
    ValidationPipe,
    Param,
} from '@nestjs/common';
// import { getConnection } from 'typeorm';

import { Team } from '../team/team.entity';
import { TeamService } from '../team/team.service';

import { GameService } from '../game/game.service';
import { User } from '../user/user.entity';
import { getManager, getConnection } from 'typeorm';
import { Game } from './game.entity';
import { Answer } from 'answer/answer.entity';
import { Score } from '../score/score.entity';
import { ScoreService } from 'score/score.service';
import { Question } from '../question/question.entity';

import * as xorBy from 'lodash/xorBy';
import * as flattenDepth from 'lodash/flattenDepth';

import * as data from '../../assets/questions.json';
import { Category } from '../category/category.entity';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly teamService: TeamService,
    private readonly gameService: GameService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    // private readonly scoreService: ScoreService,
  ) {}

  @Get()
  async getExistingGame(@Response() res: any): Promise<Score[]> {
    try {
      const recentGame = await this.gameService.getExistingGame();
      return recentGame ? res.status(HttpStatus.OK).json({
        success: true,
        payload: recentGame,
      }) : res.status(HttpStatus.NOT_FOUND).json({ success: false });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createGame(@Response() res: any, @Body() game: Game): Promise<Game> {
    try {
      await getManager().transaction(async transactionalEntityManager => {
        const newGame = await transactionalEntityManager.save(game);
        const categoriesData = data.map(dataItem => {
          const category = new Category();
          category.categoryText = dataItem.categoryName;
          category.isAllIn = dataItem.categoryName === 'All In';
          return category;
        });

        const existingCategories = await transactionalEntityManager.find(Category);
        const newCategories = xorBy(existingCategories, categoriesData, 'categoryText');
        if (newCategories && newCategories.length) {
          await transactionalEntityManager.save(Category, categoriesData);
        }

        const categories = await transactionalEntityManager.find(Category);
        const questionsData = categories.map(category => data
          .filter(dataItem => dataItem.categoryName === category.categoryText)
          .map(dataItem => dataItem.questions.map(question => {
            const newQuestion = new Question();
            newQuestion.category = category;
            newQuestion.questionText = question.questionText;
            newQuestion.game = newGame;
            newQuestion.difficulty = question.difficulty;
            newQuestion.isActive = true;
            newQuestion.answers = question.answers.map(answerData => this.answerService.buildAnswerForQuestion(answerData));
            return newQuestion;
          })));

        const questions = flattenDepth(questionsData, 2);
        await transactionalEntityManager.save(Question, questions);

        const answersData = questions.map(question => {
          const { answers } = question;
          answers.forEach(answer => answer.question = question);
          return answers;
        });

        await transactionalEntityManager.save(Answer, flattenDepth(answersData, 2));

        return newGame;
      }).then(async newGame => {
        const gameWithQuestions = await this.gameService.getGameWithQuestions(newGame.id);
        return res.status(HttpStatus.OK).json({
          success: true,
          payload: gameWithQuestions,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code,
      });
    }
  }

  @Post('toggle/:gameId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async toggleGame(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Game> {
    try {
      const gameById = await this.gameService.getGameById(gameId);
      if (gameById) {
        gameById.isActive = isActive;
        await this.gameService.toggleGame(gameById);
        const game = await this.gameService.getGameWithQuestions(gameById.id);
        return res.status(HttpStatus.OK).json({
          success: true,
          payload: game,
        });
      } else {
        throw new Error('ER_NOT_FOUND');
      }
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  @Post('play/:gameId/:questionId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async playQuestion(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Param('questionId') questionId: string,
    @Body('answers') answers: Answer[],
    @Body('team') team: Team,
  ): Promise<boolean> {
    try {
      const gameById = await this.gameService.getGameById(gameId);

      const scores = answers.map(answer => {
        const score = new Score();
        score.point = answer.point;
        score.team = team;
        score.game = gameById;
        return score;
      });

      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(scores);
        const questionIds = [];
        const questions = questionIds.map(async id => {
          const question = await transactionalEntityManager.findOne(Question, {id});
          question.isActive = false;
          return question;
        });

        await transactionalEntityManager.save(scores);

        return res.status(HttpStatus.OK).json({
          success: true,
          payload: questions,
        });
      });

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  @Get('scores/:gameId')
  async getScoresByGameId(
    @Response() res: any,
    @Param('gameId') gameId: string,
  ): Promise<Score[]> {
    try {
      const gameById = await this.gameService.getGameById(gameId);
      return res.status(HttpStatus.OK).json({
        success: true,
        payload: gameById.scores,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }
  // getQuestionCategories
}