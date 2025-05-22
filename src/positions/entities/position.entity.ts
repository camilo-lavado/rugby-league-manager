import { PositionType } from '../../position_types/entities/position_type.entity';
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

@Entity('positions')
export class Position {
@PrimaryGeneratedColumn()
id: number;

@Column({ name: 'name', type: 'varchar', length: 50 })
name: string;


@Column({name:'type_id', type: 'int'})
typeId: number;

@ManyToOne(() => PositionType, (type) => type.positions, { eager: true })
@JoinColumn({ name: 'type_id' })
type: PositionType;

//Auditoria
@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at' })
deletedAt?: Date;

}
