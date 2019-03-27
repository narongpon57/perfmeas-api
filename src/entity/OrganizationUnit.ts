import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from './Users'
import { Assessment } from './Assessment';

@Entity()
export class OrganizationUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Users, users => users.creator)
  @JoinColumn({ name: 'creator_id' })
  creator: Users

  @ManyToOne(type => Users, users => users.step1_approver)
  @JoinColumn({ name: 'step1_approver_id' })
  step1_approver: Users

  @Column({ type: 'varchar', length: 8 })
  code: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  type: string

  @OneToMany(type => Assessment, assessment => assessment.org)
  assessment: Assessment[]

}
