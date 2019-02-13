import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { OrganizationUnit } from './OrganizationUnit'

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => OrganizationUnit)
  @JoinColumn({ name: 'org_id' })
  org_id: OrganizationUnit

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'varchar', length: 100 })
  status: string

  @CreateDateColumn()
  created_at;
}
