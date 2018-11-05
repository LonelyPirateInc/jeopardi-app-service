import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Score } from '../score/score.entity';

@Entity()
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 500 })
    name: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToMany(type => User, user => user.team)
    users: User[];

    @OneToMany(type => Score, score => score.team)
    scores: Score[];
}