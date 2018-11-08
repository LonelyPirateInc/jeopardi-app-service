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
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';
import { getManager } from 'typeorm';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('submit/:gameId/:questionId')
  @UsePipes(new ValidationPipe({ transform: true }))
   async submitAnswer(
     @Response() res: any,
     @Param('gameId') gameId: string,
     @Param('questionId') questionId: string,
     @Body() answerIds: string[],
  ) {
      try {
        console.log("answerIds", answerIds);
        // get answers by id 
        const answers = await this.answerService.getAnswersById(answerIds);
        console.log(answers);

        // get teamId of user
        

        // fetch the current score of the team by teamId and gameId
        // const score = await this.scoreService.getScoresByTeamAndGameId(gameId, teamId);


        // calcualte score based on answers


        // upsert score 

          // return new score 
          return res.status(HttpStatus.OK).json({
              success: true,
              payload: 'newScore',
          });
      } catch (error) {
          return res.status(HttpStatus.BAD_REQUEST).json({
              success: false,
              message: error.code,
          });
      }
  }

}