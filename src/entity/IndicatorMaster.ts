import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RiskAssessmentIndicator } from './RiskAssessmentIndicator';

@Entity()
export class IndicatorMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 11 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true })
  reason: string

  @Column({ type: 'varchar', length: 100 })
  indicator_type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frequency: string;

  @Column({ type: 'varchar', length: 100 })
  formular: string;

  @Column({ type: 'text' })
  multiplier: string;

  @Column({ type: 'text' })
  divisor: string;

  @Column({ type: 'int' })
  unit: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  standard: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  measurement_domain: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  operator: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  target: string;

  @Column({ type: 'timestamp' })
  start_date: string;

  @Column({ type: 'timestamp', nullable: true })
  end_date: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'bit' })
  is_active: number;

  @OneToMany(type => RiskAssessmentIndicator, risk_indicator => risk_indicator.indicator)
  risk_indicator: RiskAssessmentIndicator[]
}
