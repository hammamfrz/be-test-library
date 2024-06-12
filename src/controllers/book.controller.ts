import { Controller, Get } from '@nestjs/common';
import { MemberService } from '../services/member.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly memberService: MemberService) {}

  @Get('list')
  listBooks() {
    return this.memberService.listBooks();
  }
}
