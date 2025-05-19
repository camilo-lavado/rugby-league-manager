import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Team } from '../../teams/entities/team.entity';
  // import { Position } from '../../positions/position.entity';
  // import { PlayerCaps } from '../../player-caps/player-caps.entity';
  // import { MatchParticipation } from '../../matches/entities/match-participation.entity';
  // import { PlayerSeasonStats } from '../../statistics/entities/player-season-stats.entity';
  
  @Entity('players')
  export class Player {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ name: 'user_id' })
    userId: number;
  
    @ManyToOne(() => Team, { eager: true })
    @JoinColumn({ name: 'team_id' })
    team: Team;
  
    @Column({ name: 'team_id' })
    teamId: number;
  
    // @ManyToOne(() => Position, { eager: true })
    // @JoinColumn({ name: 'position_id' })
    // position: Position;
  
    @Column({ name: 'position_id' })
    positionId: number;
  
    @Column({ name: 'jersey_number', type: 'int' })
    jerseyNumber: number;
  
    // Relaciones inversas:
  
    // @OneToMany(() => PlayerCaps, (caps) => caps.player)
    // caps: PlayerCaps[];
  
    // @OneToMany(() => MatchParticipation, (participation) => participation.player)
    // participations: MatchParticipation[];
  
    // @OneToMany(() => PlayerSeasonStats, (seasonStats) => seasonStats.player)
    // seasonStats: PlayerSeasonStats[];
  
    // Auditoría
  
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
  