import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberRepository {
  findOne(arg0: { where: { code: string } }) {
    throw new Error('Method not implemented.');
  }
  save(member: any) {
    throw new Error('Method not implemented.');
  }
  find(): Member[] | PromiseLike<Member[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  // Anda bisa menambahkan metode khusus di sini jika diperlukan
  async findAll(): Promise<Member[]> {
    return this.repository.find();
  }
}
