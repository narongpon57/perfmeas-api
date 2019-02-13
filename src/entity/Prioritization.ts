import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RiskAssessmentIndicator } from './RiskAssessmentIndicator'
import { Criteria } from './Criteria'

@Entity()
export class Prioritization {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => RiskAssessmentIndicator)
  @JoinColumn({ name: 'risk_assessment_indicator_id' })
  risk_assessment_indicator_id: RiskAssessmentIndicator

  @ManyToOne(type => Criteria)
  @JoinColumn({ name: 'criteria_id' })
  criteria_id: Criteria

  @Column({ type: 'int' })
  score: number;
}
