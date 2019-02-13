import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class IndicatorMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 11 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text' })
  reason: string

  @Column({ type: 'varchar', length: 100 })
  indicator_type: string;

  @Column({ type: 'varchar', length: 100 })
  formular: string;

  @Column({ type: 'varchar', length: 100 })
  multiplier: string;

  @Column({ type: 'varchar', length: 100 })
  divisor: string;

  @Column({ type: 'int' })
  unit: number;

  @Column({ type: 'varchar', length: 100 })
  standard: string;

  @Column({ type: 'varchar', length: 100 })
  measurement_domain: string;

  @Column({ type: 'varchar', length: 5 })
  operator: string;

  @Column({ type: 'varchar', length: 100 })
  target: string;

  @Column({ type: 'timestamp' })
  start_date: string;

  @Column({ type: 'timestamp' })
  end_date: string;

  @Column({ type: 'varchar', length: 255 })
  remark: string;

  @Column({ type: 'bit' })
  is_active: number;
}
