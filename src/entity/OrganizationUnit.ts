import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User'

@Entity()
export class OrganizationUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'creator_id' })
  creator_id: User

  @ManyToOne(type => User)
  @JoinColumn({ name: 'step1_approver_id' })
  step1_approver_id: User

  @Column({ type: 'varchar', length: 8 })
  code: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  type: string

}
