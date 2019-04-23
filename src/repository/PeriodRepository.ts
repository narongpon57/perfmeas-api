import { EntityRepository, Repository, getConnection, Like } from "typeorm";
import { AssessmentTime } from "../entity/AssessmentTime";

@EntityRepository(AssessmentTime)
export class PeriodRepository extends Repository<AssessmentTime> {

	async findByCondition(type: string, queryYear: string, name: string, status: string) {
		return await getConnection()
			.createEntityManager()
			.query(`
			SELECT *, to_char(date_from, 'dd/mm/yyyy') as date_from_string, to_char(date_to, 'dd/mm/yyyy') as date_to_string, to_char(published_date, 'dd/mm/yyyy') as published_date_string
			FROM assessment_time
			WHERE type like '%${type}%' ${queryYear} and name like '%${name}%' and status like '%${status}%'
			`)
	}

	async getLastRow() {
		return await getConnection()
			.createQueryBuilder()
			.select('assessment_time')
			.from(AssessmentTime, 'assessment_time')
			.orderBy('id', 'DESC')
			.getOne()
	}

	async findAll() {
		return await getConnection()
			.createQueryBuilder()
			.select('assessment_time')
			.from(AssessmentTime, 'assessment_time')
			.orderBy('id', 'DESC')
			.getMany()
	}

}
