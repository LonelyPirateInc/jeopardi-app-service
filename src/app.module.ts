import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { ScoreModule } from './score/score.module';
import { GameModule } from './game/game.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { CategoryModule } from './category/category.module';
import { Team } from './team/team.entity';
import { User } from './user/user.entity';
import { Game } from './game/game.entity';
import { Category } from './category/category.entity';
import { Question } from './question/question.entity';
import { Answer } from './answer/answer.entity';
import { Score } from './score/score.entity';
import { TeamController } from './team/team.controller';
import { UserController } from './user/user.controller';
import { GameController } from './game/game.controller';
import { QuestionController } from './question/question.controller';
import { AnswerController } from './answer/answer.controller';
import { ScoreController } from './score/score.controller';
import { TeamService } from './team/team.service';
import { UserService } from './user/user.service';
import { GameService } from './game/game.service';
import { QuestionService } from './question/question.service';
import { AnswerService } from './answer/answer.service';
import { ScoreService } from './score/score.service';
import { EventsModule } from 'events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Team, User, Game, Category, Question, Answer, Score]),
    AuthModule,
    UserModule,
    TeamModule,
    GameModule,
    ScoreModule,
    QuestionModule,
    AnswerModule,
    CategoryModule,
    EventsModule,
  ],
  controllers: [
    AppController,
    TeamController,
    UserController,
    GameController,
    QuestionController,
    AnswerController,
    ScoreController,
  ],
  // providers: [
  //   AppService,
  // ],
  providers: [
    AppService,
    TeamService,
    UserService,
    GameService,
    QuestionService,
    AnswerService,
    ScoreService,
  ],
})
export class AppModule {}
