import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('match_stats')
  export class MatchStat {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'fixture_id' })
    fixtureId: number;
  
    @Column({ name: 'team_id' })
    teamId: number;
  
    @Column()
    possession: number;
  
    @Column()
    tackles: number;
  
    @Column()
    metersGained: number;
  
    @Column()
    penaltiesConceded: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  