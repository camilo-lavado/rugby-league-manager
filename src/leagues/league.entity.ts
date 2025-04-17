import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity()
export class League {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, { nullable: true, eager: true })
  createdBy?: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  updatedBy?: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  deletedBy?: User;
}



