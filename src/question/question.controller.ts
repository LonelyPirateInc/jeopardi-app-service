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
}