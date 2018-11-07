import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from 'typeorm';
import { Score } from '../score/score.entity';
import { Question } from '../question/question.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column()
  isActive: boolean = false;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(type => Game, game => game.scores)
  scores: Score[];

  @OneToMany(type => Game, game => game.questions)
  questions: Question[];
}