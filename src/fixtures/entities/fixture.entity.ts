import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('fixtures')
  export class Fixture {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'league_id' })
    leagueId: number;
  
    @Column({ name: 'stadium_id' })
    stadiumId: number;
  
    @Column({ name: 'season_id' })
    seasonId: number;
  
    @Column({ name: 'referee_id' })
    refereeId: number;
  
    @Column({ name: 'match_date', type: 'timestamp' })
    matchDate: Date;
  
    @Column()
    status: string;
  
    @Column()
    phase: string;
  
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
  