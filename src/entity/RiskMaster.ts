import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RiskMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  risk_type: string;

  @Column({ type: 'varchar', length: 255 })
  identified: string;

  @Column({ type: 'varchar', length: 255 })
  problem_area: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'bit' })
  isActive: number;
}
