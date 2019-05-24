import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Assessment } from './Assessment'
import { RiskMaster } from './RiskMaster'
import { RiskAssessmentIndicator } from './RiskAssessmentIndicator';

@Entity()
export class RiskAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Assessment, assessment => assessment.risk_assessment)
  @JoinColumn({ name: 'assessment_id' })
  assessment_id: Assessment

  @ManyToOne(type => RiskMaster, risk => risk.risk_assessment)
  @JoinColumn({ name: 'risk_id' })
  risk: Assessment

  @Column({ type: 'int' })
  probability: number

  @Column({ type: 'int' })
  impact: number

  @Column({ type: 'int' })
  risk_score: number

  @Column({ type: 'text' })
  mitigation_strategy: number

  @OneToMany(type => RiskAssessmentIndicator, risk_indicator => risk_indicator.risk_assessment_id)
  risk_indicator: RiskAssessmentIndicator[]
}
