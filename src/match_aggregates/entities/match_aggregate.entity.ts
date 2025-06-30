import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('match_aggregates')
  export class MatchAggregate {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'fixture_id' })
    fixtureId: number;
  
    @Column()
    totalPoints: number;
  
    @Column()
    totalTries: number;
  
    @Column()
    totalPenalties: number;
  
    @Column()
    totalMeters: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  