import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { IndicatorMaster } from './IndicatorMaster'
import { RiskMaster } from './RiskMaster'

@Entity()
export class ExistingMeasure {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => IndicatorMaster)
  @JoinColumn({ name: 'indicator_id ' })
  indicator_id: IndicatorMaster

  @ManyToOne(type => RiskMaster)
  @JoinColumn({ name: 'risk_id ' })
  risk_id: RiskMaster
}
