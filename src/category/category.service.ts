import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {getManager, Repository} from 'typeorm';
import { Category } from './category.entity';
import { Game } from 'game/game.entity';
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getQuestionCategories(): Promise<Category[]> {
    return (await this.categoryRepository.find());
  }
}