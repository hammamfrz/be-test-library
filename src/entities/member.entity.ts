import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  borrowedBooksCount: number;

  @Column({ default: false })
  isPenalized: boolean;
}
