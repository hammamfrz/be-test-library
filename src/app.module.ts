// src/app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './services/member.service';
import { MemberController } from './controllers/member.controller';
import { BookController } from './controllers/book.controller';
import { Book } from './entities/book.entity';
import { Member } from './entities/member.entity';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { BookRepository } from './repositories/book.repository';
import { MemberRepository } from './repositories/member.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'library.db',
      entities: [Book, Member],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Book, Member]),
    SeederModule,
  ],
  controllers: [MemberController, BookController],
  providers: [MemberService, SeederService, BookRepository, MemberRepository],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
}
