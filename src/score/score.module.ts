import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TeamModule } from '../team/team.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Score]),
        TeamModule,
    ],
    providers: [ScoreService],
    controllers: [ScoreController],
    exports: [ScoreService],
})
export class ScoreModule {}