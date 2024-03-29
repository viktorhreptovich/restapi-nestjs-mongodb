import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>
  ) {
  }

  async findAll(query: Query): Promise<Book[]> {

    const resultPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);


    const keyword = query.keyword ? {
      title: new RegExp(`${query.keyword}`, 'i')
    } : {};
    return this.bookModel.find(keyword).limit(resultPerPage).skip(skip);
  }

  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id');
    }

    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });

    return await this.bookModel.create(data);
  }

  async update(id: string, book: Book): Promise<Book> {
    return this.bookModel.findByIdAndUpdate(id, book,
      {
        new: true,
        runValidators: true
      }
    );
  }

  async delete(id: string): Promise<Book> {
    return this.bookModel.findByIdAndDelete(id);
  }
}
