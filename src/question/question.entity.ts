import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Answer } from '../answer/answer.entity';
import { Category } from '../category/category.entity';
import { Game } from '../game/game.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500 })
    questionText: string;

    @Column({ length: 500 })
    musicName: string;

    @Column({ length: 500 })
    musicNamePath: string;

    @Column()
    difficulty: number;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToMany(type => Question, question => question.answers)
    answers: Answer[];

    @ManyToOne(type => Category, category => category.questions, {eager: true})
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(type => Game, game => game.questions, {eager: true})
    @JoinColumn({ name: 'game_id' })
    game: Promise<Game>|Game|number;
}