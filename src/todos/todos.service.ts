import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModal: Model<Todo>) {}

  async create(userId: Types.ObjectId, todo: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModal({
      ...todo,
      userId,
      done: false,
      createdAt: new Date(),
    });

    return createdTodo.save();
  }

  async findAll(userId: Types.ObjectId): Promise<Todo[]> {
    return this.todoModal.find({ userId }).exec();
  }

  async findOne(id: string, userId: Types.ObjectId): Promise<Todo> {
    const todo = await this.todoModal.findOne({ _id: id, userId }).exec();

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(
    id: string,
    userId: Types.ObjectId,
    todo: UpdateTodoDto,
  ): Promise<Todo> {
    await this.findOne(id, userId);

    await this.todoModal.updateOne({ _id: id }, todo).exec();

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: Types.ObjectId): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    await this.todoModal.deleteOne({ _id: id }).exec();

    return todo;
  }
}
