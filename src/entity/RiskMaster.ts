import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RiskAssessment } from './RiskAssessment';
import { ExistingMeasure } from './ExistingMeasure';


@Entity()
export class RiskMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  risk_type: string;

  @Column({ type: 'varchar', length: 255 })
  risk_group: string;

  @Column({ type: 'varchar', length: 255 })
  identified: string;

  @Column({ type: 'varchar', length: 255 })
  problem_area: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'bit' })
  is_active: number;

  @OneToMany(type => RiskAssessment, risk_assessment => risk_assessment.risk)
  risk_assessment: RiskAssessment[]

  @OneToMany(type => ExistingMeasure, existing => existing.risk)
  existing_risk: ExistingMeasure[]
}
