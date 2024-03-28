import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, Category } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const mockBook = {
    _id: '6605643700badc2b16aa91b2',
    user: '66055c6cb087d44015b917b4',
    'title': 'Lord of the Rings',
    'description': 'This is the description',
    'author': 'J.R.R. Tolkien',
    'price': 100,
    'category': Category.FANTASY
  };

  const mockBookService = {
    findById: jest.fn()
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService
        }
      ]
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findById', () => {
    it('should find and return a book by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if book id is invalid', async () => {
      const id = 'invalid-id';

      const isValidIdObjectIDMock = jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

      const findById = () => bookService.findById(id);
      await expect(findById).rejects.toThrow(BadRequestException);
      await expect(findById).rejects.toThrow('Please enter correct id');

      expect(isValidIdObjectIDMock).toHaveBeenCalledWith(id);
      isValidIdObjectIDMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      const findById = () => bookService.findById(mockBook._id);
      await expect(findById).rejects.toThrow(NotFoundException);
      await expect(findById).rejects.toThrow('Book not found');
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);

    });
  });

});
