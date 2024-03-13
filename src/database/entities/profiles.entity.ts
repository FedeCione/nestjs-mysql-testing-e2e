import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  age: number;
}
