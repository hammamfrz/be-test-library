// src/repositories/book.repository.ts
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookRepository {
  findOne(arg0: { where: { code: string } }) {
    throw new Error('Method not implemented.');
  }
  save(book: any) {
    throw new Error('Method not implemented.');
  }
  find(): Book[] | PromiseLike<Book[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
  ) {}

  // Anda bisa menambahkan metode khusus di sini jika diperlukan
  async findAll(): Promise<Book[]> {
    return this.repository.find();
  }
}
