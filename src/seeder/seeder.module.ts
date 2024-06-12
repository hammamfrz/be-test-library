import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Book } from '../entities/book.entity';
import { Member } from '../entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Member])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
