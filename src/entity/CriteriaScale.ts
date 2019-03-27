import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Criteria } from './Criteria';

@Entity()
export class CriteriaScale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Criteria, criteria => criteria.criteriaScales)
  @JoinColumn({ name: 'criteria_id' })
  criteria: Criteria;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  value: number;

}
