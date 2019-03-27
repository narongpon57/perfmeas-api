import { EntityRepository, Repository, getConnection, Like } from "typeorm";
import { RiskMaster } from "../entity/RiskMaster";

@EntityRepository(RiskMaster)
export class RiskMasterRepository extends Repository<RiskMaster> {

	async findByCondition(riskGroup: string, riskType: string, problemArea: string, identified: string) {
		return await getConnection()
			.createQueryBuilder()
			.select('risk_master')
			.from(RiskMaster, 'risk_master')
			.where(`risk_group like :risk_group and risk_type like :risk_type and problem_area like :problem_area and identified like :identified`, {
				risk_group: `%${riskGroup}%`,
				risk_type: `%${riskType}%`,
				problem_area: `%${problemArea}%`,
				identified: `%${identified}%`
			})
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

}
