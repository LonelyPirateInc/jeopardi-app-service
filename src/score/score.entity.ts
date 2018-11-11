import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';
import { Game } from '../game/game.entity';
import { Question } from 'question/question.entity';

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

    @ManyToOne(type => Team, team => team.scores, {eager: true})
    team: Team;

    @ManyToOne(type => Game, game => game.scores, {eager: true})
    game: Game;
}