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
}