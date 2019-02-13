import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Criteria } from './Criteria';

@Entity()
export class CriteriaScale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Criteria)
  @JoinColumn({ name: 'criteria_id' })
  criteria_id: Criteria;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  value: number;

}
