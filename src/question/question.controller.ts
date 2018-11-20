import {
    Controller, Post, Put, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe, Param,
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

    @Get()
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

    @Get('/:questionId')
    async getQuestionById(
        @Response() res: any,
        @Param('questionId') questionId: string,
    ): Promise<Question> {
        try {
            const question = await this.questionService.getQuestionById(questionId);
            const answers = question.answers;
            await getManager().transaction(async transactionalEntityManager => {
                question.isCurrent = true;
                delete question.answers;

                await transactionalEntityManager.save(question);

            });

            question.answers = answers;

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

    @Put('/:questionId')
    async updateQuestion(
        @Response() res: any,
        @Param('questionId') questionId: string,
        @Body() updatedQuestion: Question,
    ): Promise<Question> {
        try {
            console.log("updatedQuestion", updatedQuestion);
            await getManager().transaction(async transactionalEntityManager => {
              const response =  await transactionalEntityManager.createQueryBuilder()
                .update(Question)
                .set(updatedQuestion)
                .where("id = :id", { id: questionId })
                .execute();
                console.log(response);
            });
            return res.status(HttpStatus.OK).json({
                success: true,
                payload: updatedQuestion,
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
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code || error.message,
            });
        }
    }
}