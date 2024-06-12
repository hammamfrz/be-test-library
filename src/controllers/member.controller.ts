import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MemberService } from '../services/member.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('borrow/:memberCode/:bookCode')
  borrowBook(
    @Param('memberCode') memberCode: string,
    @Param('bookCode') bookCode: string,
  ) {
    return this.memberService.borrowBook(memberCode, bookCode);
  }

  @Post('return/:memberCode/:bookCode/:daysBorrowed')
  returnBook(
    @Param('memberCode') memberCode: string,
    @Param('bookCode') bookCode: string,
    @Param('daysBorrowed') daysBorrowed: number,
  ) {
    return this.memberService.returnBook(memberCode, bookCode, daysBorrowed);
  }

  @Get('list')
  listMembers() {
    return this.memberService.listMembers();
  }
}
