import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TeamModule } from 'team/team.module';
// import { CategoryModule } from 'category/category.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game]),
        TeamModule,
        // CategoryModule,
    ],
    providers: [GameService],
    controllers: [GameController],
    exports: [GameService],
})
export class GameModule {}