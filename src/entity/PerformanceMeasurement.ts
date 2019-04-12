import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RiskAssessmentIndicator } from './RiskAssessmentIndicator'

@Entity()
export class PerformanceMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RiskAssessmentIndicator, risk_indicator => risk_indicator.perfermance_measurement)
  @JoinColumn({ name: 'risk_assessment_indicator_id' })
  risk_assessment_indicator: RiskAssessmentIndicator

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  jan_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  feb_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  mar_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  apr_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  may_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  jun_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  jul_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  aug_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  sep_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  oct_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  nov_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  dec_multiplier_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  jan_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  feb_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  mar_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  apr_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  may_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  jun_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  jul_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  aug_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  sep_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  oct_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  nov_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  dec_divisor_value: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  summary_result: number;
}
