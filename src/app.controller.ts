import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { getManager, getConnection } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }
}
