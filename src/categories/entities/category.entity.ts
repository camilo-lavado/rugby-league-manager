import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Index()
    @Column()
    name: string;
  
    @Index()
    @Column()
    type: string;
  
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
  