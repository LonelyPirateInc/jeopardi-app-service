import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Score } from '../score/score.entity';
import { Question } from '../question/question.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 500 })
  name: string;

  @Column()
  isActive: boolean = false;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(type => Game, game => game.scores)
  scores: Score[];

  @OneToMany(type => Game, game => game.categories)
  categories: Category[];
}