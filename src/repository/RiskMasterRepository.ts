import { EntityRepository, Repository, getConnection, Like, getRepository } from "typeorm";
import { RiskMaster } from "../entity/RiskMaster";

@EntityRepository(RiskMaster)
export class RiskMasterRepository extends Repository<RiskMaster> {

	async findByCondition(riskGroup: string, riskType: string, problemArea: string, identified: string) {
		return await getRepository(RiskMaster)
			.createQueryBuilder('risk_master')
			.leftJoinAndSelect('risk_master.existing_risk', 'existing_measure')
			.leftJoinAndSelect('existing_measure.indicator', 'indicator_master')
			.where(`risk_group like :risk_group and risk_type like :risk_type and problem_area like :problem_area and identified like :identified and risk_master.is_active = B'1'`, {
				risk_group: `%${riskGroup}%`,
				risk_type: `%${riskType}%`,
				problem_area: `%${problemArea}%`,
				identified: `%${identified}%`
			})
			.orderBy('risk_master.id', 'ASC')
			.getMany()
	}

	async findByConditionMaster(riskGroup: string, riskType: string, problemArea: string, identified: string) {
		return await getRepository(RiskMaster)
			.createQueryBuilder('risk_master')
			.leftJoinAndSelect('risk_master.existing_risk', 'existing_measure')
			.leftJoinAndSelect('existing_measure.indicator', 'indicator_master')
			.where(`risk_group like :risk_group and risk_type like :risk_type and problem_area like :problem_area and identified like :identified`, {
				risk_group: `%${riskGroup}%`,
				risk_type: `%${riskType}%`,
				problem_area: `%${problemArea}%`,
				identified: `%${identified}%`
			})
			.orderBy('risk_master.id', 'ASC')
			.getMany()
	}

	async getLastRow() {
		return await getConnection()
			.createQueryBuilder()
			.select('risk_master')
			.from(RiskMaster, 'risk_master')
			.orderBy('id', 'DESC')
			.getOne()
	}

	async findAll() {
		return await getConnection()
			.createQueryBuilder()
			.select('risk_master')
			.from(RiskMaster, 'risk_master')
			.orderBy('id', 'DESC')
			.getMany()
	}

	async getRiskWithExisitingMeasure(riskId: string) {
		return await getRepository(RiskMaster)
			.createQueryBuilder('risk_master')
			.leftJoinAndSelect('risk_master.existing_risk', 'existing_measure')
			.leftJoinAndSelect('existing_measure.indicator', 'indicator_master')
			.where('risk_master.id = :id', {
				id: riskId
			})
			.getOne()
	}

}
