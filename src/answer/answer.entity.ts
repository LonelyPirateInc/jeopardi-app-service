import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    answerText: string;

    @Column({type: 'int'})
    point: number;

    @Column()
    isCorrect: boolean;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @ManyToOne(type => Question, question => question.answers)
    question: Question;
}