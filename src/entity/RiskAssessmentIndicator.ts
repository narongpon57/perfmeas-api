import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RiskAssessment } from './RiskAssessment'
import { IndicatorMaster } from './IndicatorMaster'

@Entity()
export class RiskAssessmentIndicator {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RiskAssessment)
  @JoinColumn({ name: 'risk_assessment_id' })
  risk_assessmen_id: RiskAssessment

  @ManyToOne(type => IndicatorMaster)
  @JoinColumn({ name: 'indicator_id' })
  indicator_id: IndicatorMaster
}
