import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { OrganizationUnit } from './OrganizationUnit'
import { RiskAssessment } from "./RiskAssessment";
import { Approval } from "./Approval";

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => OrganizationUnit, org => org.assessment)
  @JoinColumn({ name: 'org_id' })
  org: OrganizationUnit

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'varchar', length: 100 })
  status: string

  @CreateDateColumn()
  created_at;

  @OneToMany(type => RiskAssessment, risk_asessment => risk_asessment.assessment_id)
  risk_assessment: RiskAssessment[]

  @OneToMany(type => Approval, approval => approval.assessment)
  approval: Approval[]
}
