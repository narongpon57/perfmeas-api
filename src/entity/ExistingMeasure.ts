import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { IndicatorMaster } from './IndicatorMaster'
import { RiskMaster } from './RiskMaster'

@Entity()
export class ExistingMeasure {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => IndicatorMaster, indicator => indicator.existing_indicator)
  @JoinColumn({ name: 'indicator_id ' })
  indicator: IndicatorMaster

  @ManyToOne(type => RiskMaster, risk => risk.existing_risk)
  @JoinColumn({ name: 'risk_id ' })
  risk: RiskMaster
}
