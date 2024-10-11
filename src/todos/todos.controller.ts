import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdDto } from './dto/id.dto';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiBody({ type: CreateTodoDto })
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    return this.todosService.create(req.user.userId, createTodoDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.todosService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param() params: IdDto, @Req() req: any) {
    return this.todosService.findOne(params.id, req.user.userId);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: 'string' })
  update(
    @Param() params: IdDto,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ) {
    return this.todosService.update(params.id, req.user.userId, updateTodoDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param() params: IdDto, @Req() req: any) {
    return this.todosService.remove(params.id, req.user.userId);
  }
}
