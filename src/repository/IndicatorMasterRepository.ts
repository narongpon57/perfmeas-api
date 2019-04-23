import { EntityRepository, Repository, getConnection, Like } from "typeorm";
import { IndicatorMaster } from "../entity/IndicatorMaster";

@EntityRepository(IndicatorMaster)
export class IndicatorMasterRepository extends Repository<IndicatorMaster> {

	async findByCondition(code: string, name: string, frequency: string, indicator_type: string, standard: string, measurement_domain: string) {
		return await getConnection()
			.createQueryBuilder()
			.select('indicator_master')
			.from(IndicatorMaster, 'indicator_master')
			.where(`code like :code and name like :name and indicator_type like :indicator_type and standard like :standard and measurement_domain like :measurement_domain and frequency like :frequency`, {
				code: `%${code}%`,
				name: `%${name}%`,
				frequency: `%${frequency}%`,
				indicator_type: `%${indicator_type}%`,
				standard: `%${standard}%`,
				measurement_domain: `%${measurement_domain}%`
			})
			.orderBy('id', 'ASC')
			.getMany()
	}

	async getLastRow() {
		return await getConnection()
			.createQueryBuilder()
			.select('indicator_master')
			.from(IndicatorMaster, 'indicator_master')
			.orderBy('code', 'DESC')
			.getOne()
	}

	async findAll() {
		return await getConnection()
			.createQueryBuilder()
			.select('indicator_master')
			.from(IndicatorMaster, 'indicator_master')
			.orderBy('code', 'DESC')
			.getMany()
	}

}
