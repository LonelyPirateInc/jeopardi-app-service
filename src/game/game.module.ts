import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import {UserModule} from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Team]),
        UserModule,
    ],
    providers: [GameService],
    controllers: [GameController],
    exports: [GameService],
})
export class GameModule {}