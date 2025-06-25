import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('standings')
  export class Standing {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'league_id' })
    leagueId: number;
  
    @Column({ name: 'team_id' })
    teamId: number;
  
    @Column()
    played: number;
  
    @Column()
    won: number;
  
    @Column()
    drawn: number;
  
    @Column()
    lost: number;
  
    @Column()
    points: number;
  
    @Column()
    tries: number;
  
    @Column()
    received: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  