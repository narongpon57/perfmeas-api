import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RiskAssessment } from './RiskAssessment'
import { IndicatorMaster } from './IndicatorMaster'

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
}
