import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async borrowBook(memberCode: string, bookCode: string): Promise<string> {
    const member = await this.memberRepository.findOne({
      where: { code: memberCode },
    });
    if (!member) throw new Error('Member not found');

    if (member.isPenalized) throw new Error('Member is penalized');

    if (member.borrowedBooksCount >= 2)
      throw new Error('Cannot borrow more than 2 books');

    const book = await this.bookRepository.findOne({
      where: { code: bookCode },
    });
    if (!book) throw new Error('Book not found');

    if (book.stock <= 0) throw new Error('Book is not available');

    book.stock -= 1;
    member.borrowedBooksCount += 1;

    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    return 'Book borrowed successfully';
  }

  async returnBook(
    memberCode: string,
    bookCode: string,
    daysBorrowed: number,
  ): Promise<string> {
    const member = await this.memberRepository.findOne({
      where: { code: memberCode },
    });
    if (!member) throw new Error('Member not found');

    const book = await this.bookRepository.findOne({
      where: { code: bookCode },
    });
    if (!book) throw new Error('Book not found');

    book.stock += 1;
    member.borrowedBooksCount -= 1;

    if (daysBorrowed > 7) {
      member.isPenalized = true;
    }

    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    return 'Book returned successfully';
  }

  async listBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async listMembers(): Promise<Member[]> {
    return this.memberRepository.find();
  }
}
