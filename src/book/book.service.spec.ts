import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book, Category } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../auth/schemas/user.schema';
import { UpdateBookDto } from './dto/update-book.dto';

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

  const mockUser = {
    _id: '66055c6cb087d44015b917b4',
    'name': 'John',
    'email': 'jhon@example.com'
  };

  const mockBookService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
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

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const query = { page: '1', keyword: 'Lord' };
      jest
        .spyOn(model, 'find')
        .mockImplementation(
          () =>
            ({
              limit: () => ({
                skip: jest.fn().mockResolvedValue([mockBook])
              })
            } as any)
        );

      const result = await bookService.findAll(query);

      expect(model.find).toHaveBeenCalledWith({ title: new RegExp('Lord', 'i') });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {

      const newBook = {
        'title': 'Lord of the Rings',
        'description': 'This is the description',
        'author': 'J.R.R. Tolkien',
        'price': 100,
        'category': Category.FANTASY
      };

      jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockBook as any));

      const result = await bookService.create(
        newBook as CreateBookDto,
        mockUser as User
      );

      expect(model.create).toHaveBeenCalledWith(newBook);
      expect(result).toEqual(mockBook);
    });
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

  describe('update', () => {
    it('should update and return a book', async () => {

      const updatedBook = { ...mockBook, title: 'Lord of the Rings 3' };
      const book = { title: 'Lord of the Rings 3' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

      const result = await bookService.update(mockBook._id, book as UpdateBookDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
        new: true,
        runValidators: true
      });
      expect(result.title).toEqual(book.title);
    });
  });

  describe('delete', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookService.delete(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });
  });

});
