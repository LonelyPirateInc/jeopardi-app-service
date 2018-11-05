import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';
import { Game } from '../game/game.entity';

@Entity()
export class Score {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    point: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @ManyToOne(type => Team, team => team.scores)
    team: Team;

    @ManyToOne(type => Game, game => game.scores)
    game: Game;
}