import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from './schemas/book.schema';
import { PassportModule } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { BookId } from './params/book.id';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  const mockUser = {
    _id: '66055c6cb087d44015b917b4',
    'name': 'John',
    'email': 'jhon@example.com',
    'password': 'hashedPassword'
  };

  const mockBook = {
    _id: '6605643700badc2b16aa91b2',
    user: mockUser as User,
    'title': 'Lord of the Rings',
    'description': 'This is the description',
    'author': 'J.R.R. Tolkien',
    'price': 100,
    'category': Category.FANTASY
  };

  const mockBookService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService
        }
      ]
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookController = module.get<BookController>(BookController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(bookController).toBeDefined();
    expect(bookService).toBeDefined();
  });

  describe('getAllBooks', () => {

    it('should get all books', async () => {
      const query = { page: '1', keyword: 'Lord' };
      jest.spyOn(bookService, 'findAll').mockResolvedValue([mockBook]);

      const result = await bookController.getAllBooks(query);

      expect(bookService.findAll).toHaveBeenCalledTimes(1);
      expect(bookService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual([mockBook]);
    });

  });

  describe('createBook', () => {

    it('should create a book', async () => {
      const newBook = {
        'title': 'Lord of the Rings',
        'description': 'This is the description',
        'author': 'J.R.R. Tolkien',
        'price': 50,
        'category': Category.FANTASY
      };

      jest.spyOn(bookService, 'create').mockResolvedValue(mockBook);

      const result = await bookController.createBook(newBook as CreateBookDto, { user: mockUser as User });

      // expect(bookService.create).toHaveBeenCalledTimes(1);
      expect(bookService.create).toHaveBeenCalledWith(newBook, mockUser);
      expect(result).toEqual(mockBook);
    });
  });

  describe('getBook', () => {

    it('should get a book by id', async () => {
      const bookId = { id: '6605643700badc2b16aa91b2' } as BookId;
      jest.spyOn(bookService, 'findById').mockResolvedValue(mockBook);

      const result = await bookController.getBook(bookId);

      expect(bookService.findById).toHaveBeenCalledWith(bookId.id);
      expect(result).toEqual(mockBook);
    });
  });

  describe('updateBook', () => {

    it('should update a book', async () => {
      const updatedBook = { ...mockBook, title: 'Lord of the Rings 3' };
      const book = { title: 'Lord of the Rings 3' };

      jest.spyOn(bookService, 'update').mockResolvedValue(updatedBook);

      const result = await bookController.updateBook({ id: mockBook._id } as BookId, book as UpdateBookDto);

      expect(bookService.update).toHaveBeenCalledWith(mockBook._id, book);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('deleteBook', () => {

    it('should delete a book', async () => {
      const bookId = { id: '6605643700badc2b16aa91b2' } as BookId;
      jest.spyOn(bookService, 'delete').mockResolvedValue({ deleted: true } as any);

      const result = await bookController.deleteBook(bookId);

      expect(bookService.delete).toHaveBeenCalledWith(bookId.id);
      expect(result).toEqual({ deleted: true });
    });
  });
});
