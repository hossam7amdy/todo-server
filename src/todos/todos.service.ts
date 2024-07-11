import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModal: Model<Todo>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModal({
      ...createTodoDto,
      done: false,
      createdAt: new Date(),
    });

    return createdTodo.save();
  }

  async findAll(userId: string): Promise<Todo[]> {
    return this.todoModal.find({ userId });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModal.findById(id).exec();

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    await this.findOne(id);

    await this.todoModal.updateOne({ _id: id }, updateTodoDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<Todo> {
    const todo = await this.findOne(id);

    await this.todoModal.deleteOne({ _id: id });

    return todo;
  }
}
