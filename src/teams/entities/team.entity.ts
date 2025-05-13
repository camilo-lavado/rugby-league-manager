import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    UpdateDateColumn,
    JoinColumn,
    In,
    Index,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { League } from '../../leagues/league.entity';
  
  @Entity()
  export class Team {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Index()
    @Column()
    name: string;
  
    @Index()
    @Column()
    country: string;
  
    @Column()
    logoUrl: string;
  
    @Index()
    @Column({ nullable: true })
    leagueId?: number;
  
    @ManyToOne(() => League, { nullable: true, eager: true })
    @JoinColumn({ name: 'leagueId' })
    league?: League;
  
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
  