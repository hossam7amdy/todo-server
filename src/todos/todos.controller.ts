import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdDto } from './dto/id.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    return this.todosService.create(req.user.userId, createTodoDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.todosService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param() params: IdDto, @Req() req: any) {
    return this.todosService.findOne(params.id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param() params: IdDto,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ) {
    return this.todosService.update(params.id, req.user.userId, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param() params: IdDto, @Req() req: any) {
    return this.todosService.remove(params.id, req.user.userId);
  }
}
