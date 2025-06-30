import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('player_caps')
  export class PlayerCap {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'player_id' })
    playerId: number;
  
    @Column({ name: 'fixture_id' })
    fixtureId: number;
  
    @Column()
    caps: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  