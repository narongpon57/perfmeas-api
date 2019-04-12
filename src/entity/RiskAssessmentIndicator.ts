import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { RiskAssessment } from './RiskAssessment'
import { IndicatorMaster } from './IndicatorMaster'
import { PerformanceMeasurement } from './PerformanceMeasurement';

@Entity()
export class RiskAssessmentIndicator {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RiskAssessment, risk_assessment => risk_assessment.risk_indicator)
  @JoinColumn({ name: 'risk_assessment_id' })
  risk_assessment_id: RiskAssessment

  @ManyToOne(type => IndicatorMaster, indicator => indicator.risk_indicator)
  @JoinColumn({ name: 'indicator_id' })
  indicator: IndicatorMaster

  @Column({ type: 'int', nullable: true })
  priority_score: number

  @OneToOne(type => PerformanceMeasurement, perf => perf.risk_assessment_indicator)
  perfermance_measurement: PerformanceMeasurement

}
