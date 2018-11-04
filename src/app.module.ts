import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { ScoreModule } from './score/score.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
      TypeOrmModule.forRoot(),
      AuthModule,
      UserModule,
      TeamModule,
      GameModule,
      ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
