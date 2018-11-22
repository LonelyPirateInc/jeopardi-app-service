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
    Delete,
} from '@nestjs/common';

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
import * as groupBy from 'lodash/groupBy';
import * as forIn from 'lodash/forIn';
import * as flattenDepth from 'lodash/flattenDepth';

import * as data from '../../assets/questions.json';
import * as teamData from '../../assets/teams.json';
import { Category } from '../category/category.entity';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';
import { EventsGateway } from '../events/events.gateway';

@Controller('game')
export class GameController {
  constructor(
    private readonly teamService: TeamService,
    private readonly gameService: GameService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    private readonly scoreService: ScoreService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  /**
   * Returns the most recent game that exists in the database
   *
   * @param {any} res response object
   * @returns {Promise<Game>}
   */
  @Get()
  async getExistingGame(@Response() res: any): Promise<Game> {
    try {
      const recentGame = await this.gameService.getExistingGame();
      this.eventsGateway.onCantPlay();
      return recentGame
        ? res.status(HttpStatus.OK).json({
            success: true,
            payload: recentGame,
          })
        : res.status(HttpStatus.NOT_FOUND).json({ success: false });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message
      });
    }
  }

  /**
   * Creates a game and return the new game
   *
   * @param {any} res response object
   * @param {Game} game request body object transformed as Game entity
   * @returns {Promise<Game>}
   */
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createGame(@Response() res: any, @Body() game: Game): Promise<Game> {
    try {
      await getManager().transaction(async transactionalEntityManager => {
        const newGame = await transactionalEntityManager.save(game);
        const teamsData = teamData.map((dataItem: { name: string }) => {
          const team = new Team();
          team.name = dataItem.name;
          return team;
        });

        const existingTeams = await transactionalEntityManager.find(Team);
        const newTeams = xorBy(existingTeams, teamsData, 'name');
        if (newTeams && newTeams.length) {
          await transactionalEntityManager.save(Team, newTeams);
        }

        const categoriesData = data.map(dataItem => {
          const category = new Category();
          category.categoryText = dataItem.categoryName;
          category.isAllIn = dataItem.categoryName === 'ALL IN';
          return category;
        });

        const existingCategories = await transactionalEntityManager.find(Category);
        const newCategories = xorBy(
          existingCategories,
          categoriesData,
          'categoryText',
        );
        if (newCategories && newCategories.length) {
          await transactionalEntityManager.save(Category, categoriesData);
        }

        const categories = await transactionalEntityManager.find(Category);
        const questionsData = categories.map((category: Category) => data
          .filter(dataItem => dataItem.categoryName === category.categoryText)
          .map((dataItem: { categoryName: string; questions: any[] }) => dataItem.questions
            .map((question: Question) => {
              const newQuestion = new Question();
              newQuestion.category = category;
              newQuestion.questionText = question.questionText;
              newQuestion.game = newGame;
              newQuestion.musicNamePath = question.musicNamePath;
              newQuestion.musicName = question.musicName;
              newQuestion.difficulty = question.difficulty;
              newQuestion.isActive = true;
              newQuestion.answers = question.answers.map(answerData => this.answerService.buildAnswerForQuestion(answerData));
              return newQuestion;
            })));

        const questions = flattenDepth(questionsData, 2);
        await transactionalEntityManager.save(Question, questions);
        const answersData = questions.map(question => {
          const { answers } = question;
          answers.forEach(answer => (answer.question = question));
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

  /**
   * Toggles a game and return the updated game
   *
   * @param {any} res response object
   * @param {string} gameId request param object
   * @param {boolean} isActive request body object
   * @returns {Promise<Game>}
   */
  @Post('toggle/:gameId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async toggleGame(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Game> {
    try {
      const game = await this.gameService.getGameById(gameId);
      if (game) {
        game.isActive = isActive;
        await this.gameService.toggleGame(game);
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

  /**
   * Plays a question and insert a score with point calculated by answers
   *
   * @param {any} res response object
   * @param {string} gameId request param object
   * @param {string} questionId request param object
   * @param {Answer[]} answers request param object
   * @param {Team} team request body object
   * @param {boolean} isAllInQuestion request body object
   * @returns {Promise<boolean>}
   */
  @Post('play/:gameId/:questionId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async playQuestion(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Param('questionId') questionId: string,
    @Body('answers') answers: Answer[],
    @Body('team') team: Team,
    @Body('isAllInQuestion') isAllInQuestion: boolean,
  ): Promise<boolean> {
    try {
      if (!answers.length) {
        return res.status(HttpStatus.OK).json({
          success: true,
          payload: 0,
        });
      }

      if (isAllInQuestion) {
        // check if user selected JUST the right answer
        const wrongAnswer = answers.some(answer => answer.isCorrect === false);

        if (wrongAnswer) {
          await getManager().transaction(async transactionalEntityManager => {
            const gameById = await this.gameService.getGameById(gameId);

            // fetch current points total
            const currentScores = await transactionalEntityManager.find(Score, {
              where: { teamId: team.id, gameId },
            });

            const currentTotalPoints = currentScores.reduce((initial, scoreItem) => scoreItem.point + initial, 0);
            const newScore = new Score();
            newScore.point = currentTotalPoints <= 0 ? currentTotalPoints : 0;
            newScore.team = team;
            newScore.game = gameById;
            await transactionalEntityManager.save(newScore);
            const scores = await this.scoreService.getScoresByTeamAndGameId(team.id, gameId);
            const updatedScores = scores.map(score => {
              score.point = 0;
              return score;
            });
            await transactionalEntityManager.save(Score, updatedScores);

            const question = await transactionalEntityManager.findOne(
              Question,
              { id: questionId },
            );
            // first client that submits the question will trigger the flip for all the other clients which will cause a bug
            question.isActive = false;
            await transactionalEntityManager.save(question);

            return res.status(HttpStatus.OK).json({
              success: true,
              payload: 0,
            });
          });
        } else {
          await getManager().transaction(async transactionalEntityManager => {
            const scores = await this.scoreService.getScoresByTeamAndGameId(team.id, gameId);
            const currentTotalPoints = scores.reduce((initial, scoreItem) => scoreItem.point + initial, 0);
            const gameById = await this.gameService.getGameById(gameId);
            const score = new Score();
            score.point = currentTotalPoints;
            score.team = team;
            score.game = gameById;
            await transactionalEntityManager.save(score);
            const question = await transactionalEntityManager.findOne(
              Question,
              { id: questionId },
            );
            // first client that submits the question will trigger the flip for all the other clients which will cause a bug
            question.isActive = false;
            await transactionalEntityManager.save(question);
            const newScores = await this.scoreService.getScoresByTeamAndGameId(team.id, gameId);
            const newTotalPoints = newScores.reduce(
              (initial, scoreItem) => scoreItem.point + initial,
              0,
            );
            return res.status(HttpStatus.OK).json({
              success: true,
              payload: newTotalPoints,
            });
          });
        }
      } else {
        const points = answers.reduce((initialPoint, answer) => initialPoint + answer.point, 0);
        await getManager().transaction(async transactionalEntityManager => {
          const gameById = await this.gameService.getGameById(gameId);
          const score = new Score();
          score.point = points;
          score.team = team;
          score.game = gameById;
          await transactionalEntityManager.save(score);
          const question = await transactionalEntityManager.findOne(Question, { id: questionId });
          // first client that submits the question will trigger the flip for all the other clients which will cause a bug
          question.isActive = false;
          await transactionalEntityManager.save(question);
          const scores = await this.scoreService.getScoresByTeamAndGameId(team.id, gameId );
          const totalPoint = scores.reduce((initial, scoreItem) => scoreItem.point + initial, 0);
          return res.status(HttpStatus.OK).json({
            success: true,
            payload: totalPoint,
          });
        });
      }
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  /**
   * Returns scores for all teams by game
   *
   * @param {any} res response object
   * @param {string} gameId request param object
   * @returns {Promise<Team[]>}
   */
  @Get(':gameId/scores')
  async getScoresByGameId(
    @Response() res: any,
    @Param('gameId') gameId: string,
  ): Promise<Team[]> {
    try {
      const gameScores = await this.scoreService.getScoresByGameId(gameId);
      const scoresSortedByTeam = groupBy(gameScores, score => score.team.id);
      const keys = Object.keys(scoresSortedByTeam);

      const teamsWithScore = keys.map(key => {
        let totalPoint = 0;
        const scores = scoresSortedByTeam[key];
        const { team } = scores[0];
        team['point'] = scores.reduce((initial, score) => initial + score.point, totalPoint);
        return team;
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        payload: teamsWithScore,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }

  /**
   * Returns score by team per game
   *
   * @param {any} res response object
   * @param {string} gameId request param object
   * @param {string} teamId request param object
   * @returns {Promise<number>}
   */
  @Get(':gameId/:teamId')
  async getGameScoreByTeamId(
    @Response() res: any,
    @Param('gameId') gameId: string,
    @Param('teamId') teamId: string,
  ): Promise<number> {
    try {
      let totalScore = 0;
      const scoresByTeam = await this.scoreService.getScoresByTeamAndGameId(teamId, gameId);
      if (scoresByTeam) {
        totalScore = scoresByTeam.reduce((initial, score) => score.point + initial, totalScore);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        payload: totalScore,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.code || error.message,
      });
    }
  }
}
