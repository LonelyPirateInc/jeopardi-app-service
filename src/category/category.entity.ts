import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';
import { Game } from '../game/game.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  id: number;

  @Column()
  categoryText: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(type => Category, category => category.questions)
  questions: Question[];
}