import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('match_participation')
  export class MatchParticipation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'fixture_id' })
    fixtureId: number;
  
    @Column({ name: 'player_id' })
    playerId: number;
  
    @Column()
    minutesPlayed: number;
  
    @Column({ default: false })
    isStarting: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  