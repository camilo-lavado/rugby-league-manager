import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('scores')
  export class Score {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'fixture_id' })
    fixtureId: number;
  
    @Column({ name: 'team_id' })
    teamId: number;
  
    @Column()
    tries: number;
  
    @Column()
    conversions: number;
  
    @Column()
    penalties: number;
  
    @Column()
    dropGoals: number;
  
    @Column()
    totalPoints: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  