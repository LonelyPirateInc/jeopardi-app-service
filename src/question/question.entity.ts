import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from '../answer/answer.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    questionText: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToMany(type => Question, question => question.answers)
    answers: Answer[];

    @ManyToOne(type => Category, category => category.questions)
    category: Category;
}