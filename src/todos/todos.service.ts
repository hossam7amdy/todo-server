import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Todo[]> {
    return this.todoModal.find();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModal.findById(id);

    if (!todo) {
      throw new Error('Todo not found');
    }

    return todo.toObject({
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const oldTodo = await this.findOne(id);

    await this.todoModal.updateOne({ _id: id }, updateTodoDto);

    return { ...oldTodo, ...updateTodoDto };
  }

  async remove(id: string): Promise<Todo> {
    const todo = await this.findOne(id);

    await this.todoModal.deleteOne({ _id: id });

    return todo;
  }
}
