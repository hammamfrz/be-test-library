import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';

describe('MemberService', () => {
  let service: MemberService;
  let memberRepository: Repository<Member>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('borrowBook', () => {
    it('should throw error when member not found', async () => {
      const memberCode = '123';
      const bookCode = '456';
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(null);
      await expect(service.borrowBook(memberCode, bookCode)).rejects.toThrow(
        'Member not found',
      );
    });

    it('should throw error when member is penalized', async () => {
      const memberCode = '123';
      const bookCode = '456';
      jest
        .spyOn(memberRepository, 'findOne')
        .mockResolvedValue({ isPenalized: true } as Member);
      await expect(service.borrowBook(memberCode, bookCode)).rejects.toThrow(
        'Member is penalized',
      );
    });

    it('should throw error when member borrowedBooksCount >= 2', async () => {
      const memberCode = '123';
      const bookCode = '456';
      jest
        .spyOn(memberRepository, 'findOne')
        .mockResolvedValue({ borrowedBooksCount: 2 } as Member);
      await expect(service.borrowBook(memberCode, bookCode)).rejects.toThrow(
        'Cannot borrow more than 2 books',
      );
    });

    it('should throw error when book not found', async () => {
      const memberCode = '123';
      const bookCode = '456';
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue({} as Member);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);
      await expect(service.borrowBook(memberCode, bookCode)).rejects.toThrow(
        'Book not found',
      );
    });

    it('should throw error when book stock <= 0', async () => {
      const memberCode = '123';
      const bookCode = '456';
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue({} as Member);
      jest
        .spyOn(bookRepository, 'findOne')
        .mockResolvedValue({ stock: 0 } as Book);
      await expect(service.borrowBook(memberCode, bookCode)).rejects.toThrow(
        'Book is not available',
      );
    });

    it('should borrow book successfully', async () => {
      const memberCode = '123';
      const bookCode = '456';
      jest
        .spyOn(memberRepository, 'findOne')
        .mockResolvedValue({ borrowedBooksCount: 1 } as Member);
      jest
        .spyOn(bookRepository, 'findOne')
        .mockResolvedValue({ stock: 1 } as Book);
      jest.spyOn(bookRepository, 'save').mockResolvedValue({} as Book);
      jest.spyOn(memberRepository, 'save').mockResolvedValue({} as Member);
      await expect(service.borrowBook(memberCode, bookCode)).resolves.toBe(
        'Book borrowed successfully',
      );
    });
  });

  describe('returnBook', () => {
    it('should throw error when member not found', async () => {
      const memberCode = '123';
      const bookCode = '456';
      const daysBorrowed = 1;
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.returnBook(memberCode, bookCode, daysBorrowed),
      ).rejects.toThrow('Member not found');
    });

    it('should throw error when book not found', async () => {
      const memberCode = '123';
      const bookCode = '456';
      const daysBorrowed = 1;
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue({} as Member);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.returnBook(memberCode, bookCode, daysBorrowed),
      ).rejects.toThrow('Book not found');
    });

    it('should return book successfully', async () => {
      const memberCode = '123';
      const bookCode = '456';
      const daysBorrowed = 1;
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue({} as Member);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue({} as Book);
      jest.spyOn(bookRepository, 'save').mockResolvedValue({} as Book);
      jest.spyOn(memberRepository, 'save').mockResolvedValue({} as Member);
      await expect(
        service.returnBook(memberCode, bookCode, daysBorrowed),
      ).resolves.toBe('Book returned successfully');
    });
  });

  describe('listBooks', () => {
    it('should list books', async () => {
      jest.spyOn(bookRepository, 'find').mockResolvedValue([]);
      await expect(service.listBooks()).resolves.toEqual([]);
    });
  });

  describe('listMembers', () => {
    it('should list members', async () => {
      jest.spyOn(memberRepository, 'find').mockResolvedValue([]);
      await expect(service.listMembers()).resolves.toEqual([]);
    });
  });
});
