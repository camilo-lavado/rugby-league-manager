import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('match_teams')
  export class MatchTeam {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'fixture_id' })
    fixtureId: number;
  
    @Column({ name: 'team_id' })
    teamId: number;
  
    @Column({ default: false })
    isHome: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  