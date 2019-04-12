import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RiskAssessment } from './RiskAssessment';

@Entity()
export class Test {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'numeric', precision: 10, scale: 2 })
	test: number;
}
