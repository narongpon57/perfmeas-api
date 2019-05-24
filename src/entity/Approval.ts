import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assessment } from './Assessment';
import { Users } from './Users'

@Entity()
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Assessment, assessment => assessment.approval)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment

  @ManyToOne(type => Users, user => user.approval)
  @JoinColumn({ name: 'step2_approver_id' })
  created_by: Users

  @Column({ type: 'varchar', length: 100 })
  status: string

  @Column({ type: 'text', nullable: true })
  description: string

  @CreateDateColumn()
  approved_at;
}
