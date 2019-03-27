import { EntityRepository, Repository, getConnection, Like } from "typeorm";
import { IndicatorMaster } from "../entity/IndicatorMaster";

@EntityRepository(IndicatorMaster)
export class IndicatorMasterRepository extends Repository<IndicatorMaster> {

	async findByCondition(name: string, indicator_type: string, standard: string, measurement_domain: string) {
		return await getConnection()
			.createQueryBuilder()
			.select('indicator_master')
			.from(IndicatorMaster, 'indicator_master')
			.where(`name like :name and indicator_type like :indicator_type and standard like :standard and measurement_domain like :measurement_domain`, {
				name: `%${name}%`,
				indicator_type: `%${indicator_type}%`,
				standard: `%${standard}%`,
				measurement_domain: `%${measurement_domain}%`
			})
			.getMany()
	}

	async getLastRow() {
		return await getConnection()
			.createQueryBuilder()
			.select('indicator_master')
			.from(IndicatorMaster, 'indicator_master')
			.orderBy('id', 'DESC')
			.getOne()
	}

	async findAll() {
		return await getConnection()
			.createQueryBuilder()
			.select('indicator_master')
			.from(IndicatorMaster, 'indicator_master')
			.orderBy('id', 'DESC')
			.getMany()
	}

}
