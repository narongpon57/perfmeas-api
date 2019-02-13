import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Assessment } from './Assessment'
import { RiskMaster } from './RiskMaster'

@Entity()
export class RiskAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Assessment)
  @JoinColumn({ name: 'assessment_id ' })
  assessment_id: Assessment

  @ManyToOne(type => RiskMaster)
  @JoinColumn({ name: 'risk_id ' })
  risk_id: Assessment

  @Column({ type: 'int' })
  probability: number;

  @Column({ type: 'int' })
  impact: number;

  @Column({ type: 'int' })
  risk_score: number;

  @Column({ type: 'text' })
  migration_strategy: number;
}
