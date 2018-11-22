import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TeamModule } from '../team/team.module';
import { QuestionModule } from '../question/question.module';
import { AnswerModule } from '../answer/answer.module';
import { CategoryModule } from '../category/category.module';
import { ScoreModule } from '../score/score.module';
import { EventsModule } from 'events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    TeamModule,
    QuestionModule,
    AnswerModule,
    CategoryModule,
    ScoreModule,
    EventsModule,
  ],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}