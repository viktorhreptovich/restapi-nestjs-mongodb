import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApiResponse } from '@nestjs/swagger';
import { BookId } from './params/book.id';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookController {

  constructor(private readonly bookService: BookService) {
  }

  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return await this.bookService.findAll(query);
  }

  @ApiResponse({ status: 200, type: Book, description: 'Returns the book with the given id.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @Get(':id')
  async getBook(@Param() params: BookId): Promise<Book> {
    return await this.bookService.findById(params.id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createBook(
    @Body() book: CreateBookDto,
    @Req() req: any
  ): Promise<Book> {
    return await this.bookService.create(book, req.user);
  }

  @Put(':id')
  async updateBook(@Param() params: BookId, @Body() book: UpdateBookDto): Promise<Book> {
    return await this.bookService.update(params.id, book);
  }

  @Delete(':id')
  async deleteBook(@Param() params: BookId): Promise<Book> {
    return await this.bookService.delete(params.id);
  }
}
