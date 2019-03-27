import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RiskAssessmentIndicator } from './RiskAssessmentIndicator'

@Entity()
export class PerformanceMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RiskAssessmentIndicator)
  @JoinColumn({ name: 'risk_assessment_indicator_id' })
  risk_assessment_indicator_id: RiskAssessmentIndicator

  @Column({ type: 'float', nullable: true })
  jan_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  feb_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  mar_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  apr_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  may_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  jun_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  jul_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  aug_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  sep_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  oct_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  nov_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  dec_multiplier_value: number;

  @Column({ type: 'float', nullable: true })
  jan_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  feb_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  mar_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  apr_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  may_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  jun_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  jul_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  aug_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  sep_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  oct_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  nov_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  dec_divisor_value: number;

  @Column({ type: 'float', nullable: true })
  summary_result: number;
}
