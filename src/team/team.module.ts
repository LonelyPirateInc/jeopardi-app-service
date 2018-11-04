import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import {UserModule} from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Team]),
        UserModule,
    ],
    providers: [TeamService],
    controllers: [TeamController],
    exports: [TeamService],
})
export class TeamModule {}