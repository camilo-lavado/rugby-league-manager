import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { PositionType } from '../../position_types/entities/position_type.entity';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('positions')
  export class Position {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ name: 'type_id' })
    typeId: number;
  
    @ManyToOne(() => PositionType, { eager: true })
    @JoinColumn({ name: 'type_id' })
    type: PositionType;
  
    // Auditoría
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at' })
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
  