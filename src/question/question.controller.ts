import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe, Param,
} from '@nestjs/common';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { getManager } from 'typeorm';
import { GameService } from 'game/game.service';

@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
    ) {}

    @Get('/:questionId')
    async getScoresByGameId(
        @Response() res: any,
        @Param('questionId') questionId: string,
    ): Promise<Question> {
        try {
            const question = await this.questionService.getQuestionById(questionId);
            await getManager().transaction(async transactionalEntityManager => {
                
            await transactionalEntityManager.createQueryBuilder()
                        .update(Question)
                        .set({ isCurrent: true })
                        .where("id = :id", { id: questionId })
                        .execute();
            });

            return res.status(HttpStatus.OK).json({
                success: true,
                payload: question,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code || error.message,
            });
        }
    }


    @Get('/currentQuestion')
    async getCurrentQuestion(
        @Response() res: any,
    ): Promise<Question> {
        try {
            const question = await this.questionService.getCurrentQuestion();
            return res.status(HttpStatus.OK).json({
                success: true,
                payload: question,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code || error.message,
            });
        }
    }

    @Post('toggle/:questionId')
    async toggleQuestionById(
        @Response() res: any,
        @Param('questionId') questionId: string,
        @Body('isActive') isActive: boolean,
    ): Promise<Question> {
        try {
            const question = await this.questionService.getQuestionById(questionId);
            question.isActive = isActive;
            const updatedQuestion = await this.questionService.toggleQuestion(question);
            return res.status(HttpStatus.OK).json({
                success: true,
                payload: updatedQuestion,
            });
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code || error.message,
            });
        }
    }
}