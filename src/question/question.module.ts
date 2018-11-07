import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TeamModule } from '../team/team.module';
import { AnswerModule } from '../answer/answer.module';
import { CategoryModule } from '../category/category.module';
import { GameModule } from 'game/game.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Question]),
        TeamModule,
        AnswerModule,
        CategoryModule,
    ],
    providers: [QuestionService],
    controllers: [QuestionController],
    exports: [QuestionService],
})
export class QuestionModule {}