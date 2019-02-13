import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RiskAssessmentIndicator } from './RiskAssessmentIndicator'

@Entity()
export class PerformanceMeasurement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RiskAssessmentIndicator)
  @JoinColumn({ name: 'risk_assessment_indicator_id' })
  risk_assessment_indicator_id: RiskAssessmentIndicator

  @Column({ type: 'float' })
  jan_multiplier_value: number;

  @Column({ type: 'float' })
  feb_multiplier_value: number;

  @Column({ type: 'float' })
  mar_multiplier_value: number;

  @Column({ type: 'float' })
  apr_multiplier_value: number;

  @Column({ type: 'float' })
  may_multiplier_value: number;

  @Column({ type: 'float' })
  jun_multiplier_value: number;

  @Column({ type: 'float' })
  jul_multiplier_value: number;

  @Column({ type: 'float' })
  aug_multiplier_value: number;

  @Column({ type: 'float' })
  sep_multiplier_value: number;

  @Column({ type: 'float' })
  oct_multiplier_value: number;

  @Column({ type: 'float' })
  nov_multiplier_value: number;

  @Column({ type: 'float' })
  dec_multiplier_value: number;

  @Column({ type: 'float' })
  jan_divisor_value: number;

  @Column({ type: 'float' })
  feb_divisor_value: number;

  @Column({ type: 'float' })
  mar_divisor_value: number;

  @Column({ type: 'float' })
  apr_divisor_value: number;

  @Column({ type: 'float' })
  may_divisor_value: number;

  @Column({ type: 'float' })
  jun_divisor_value: number;

  @Column({ type: 'float' })
  jul_divisor_value: number;

  @Column({ type: 'float' })
  aug_divisor_value: number;

  @Column({ type: 'float' })
  sep_divisor_value: number;

  @Column({ type: 'float' })
  oct_divisor_value: number;

  @Column({ type: 'float' })
  nov_divisor_value: number;

  @Column({ type: 'float' })
  dec_divisor_value: number;

  @Column({ type: 'float' })
  summary_result: number;
}
