import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('player_season_stats')
  export class PlayerSeasonStat {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'player_id' })
    playerId: number;
  
    @Column({ name: 'season_id' })
    seasonId: number;
  
    @Column()
    matchesPlayed: number;
  
    @Column()
    tries: number;
  
    @Column()
    points: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  