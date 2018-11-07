import {
    Controller, Post, HttpStatus, Get, Response, Body, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { getManager } from 'typeorm';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get('')
    async getQuestionCategories(@Response() res: any): Promise<Category[]> {
        try {
            const categories = await this.categoryService.getQuestionCategories();
            return res.status(HttpStatus.OK).json({
                success: true,
                payload: categories,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.code || error.message,
            });
        }
    }
}