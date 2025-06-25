import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('stadiums')
  export class Stadium {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    location: string;
  
    @Column()
    capacity: number;
  
    @Column({ name: 'surface_type' })
    surfaceType: string;
  
    @Column({ nullable: true })
    status?: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  
    @ManyToOne(() => User, { nullable: true, eager: true })
    @JoinColumn({ name: 'created_by' })
    createdBy?: User;
  
    @ManyToOne(() => User, { nullable: true, eager: true })
    @JoinColumn({ name: 'updated_by' })
    updatedBy?: User;
  
    @ManyToOne(() => User, { nullable: true, eager: true })
    @JoinColumn({ name: 'deleted_by' })
    deletedBy?: User;
  }
  