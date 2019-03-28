import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Approval } from './Approval';
import { OrganizationUnit } from './OrganizationUnit';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 50, select: false })
  password: string;

  @Column({ type: 'varchar', length: 6 })
  employee_code: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'bit' })
  is_admin: number;

  @OneToMany(type => Approval, approval => approval.assessment)
  approval: Approval[]

  @OneToMany(type => OrganizationUnit, orgnization => orgnization.step1_approver)
  step1_approver: OrganizationUnit[]

  @OneToMany(type => OrganizationUnit, orgnization => orgnization.creator)
  creator: OrganizationUnit[]
}
