/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export type UserRole = 'admin' | 'user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // evita exponerlo al serializar
  password: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole;
}
