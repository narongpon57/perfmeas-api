import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assessment } from './Assessment';
import { User } from './User'

@Entity()
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Assessment)
  @JoinColumn({ name: 'assessment_id' })
  assessment_id: Assessment

  @ManyToOne(type => User)
  @JoinColumn({ name: 'step2_approver_id' })
  step2_approver_id: User

  @Column({ type: 'varchar', length: 100 })
  status: string

  @Column({ type: 'text' })
  description: string

  @CreateDateColumn()
  approved_at;
}
