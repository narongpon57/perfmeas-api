import { EntityRepository, Repository, getConnection, getRepository } from "typeorm";
import { Prioritization } from "../entity/Prioritization";

@EntityRepository(Prioritization)
export class PrioritizationRepository extends Repository<Prioritization> {

	async getPrioritization(org_id: number, year: string) {
		return await getConnection()
			.createEntityManager()
			.query(`
			SELECT rai.id as risk_assessment_indicator_id, rai.priority_score, im.code, im.name, im.indicator_type
			FROM risk_assessment_indicator rai
			LEFT JOIN indicator_master im on im.id = rai.indicator_id
			LEFT JOIN risk_assessment ra on ra.id = rai.risk_assessment_id
			LEFT JOIN assessment a on a.id = ra.assessment_id
			WHERE a.org_id = $1 and a.year = $2 and a.status = 'QIKM Approve'
			ORDER BY rai.priority_score desc, im.code asc
			`, [org_id, year])
	}

	async getPrioritizationByIndicator(indicatorId: number, year: string) {
		return await getConnection()
			.createEntityManager()
			.query(`
			SELECT rai.id as risk_assessment_indicator_id, rai.priority_score, im.code, im.name, im.indicator_type, 
			ou.name as organization_name, ou.id as organization_id, ou.code as organization_code
			FROM risk_assessment_indicator rai
			LEFT JOIN indicator_master im on im.id = rai.indicator_id
			LEFT JOIN risk_assessment ra on ra.id = rai.risk_assessment_id
			LEFT JOIN assessment a on a.id = ra.assessment_id
			LEFT JOIN organization_unit ou on ou.id = a.org_id
			WHERE im.id = $1 and a.year = $2 and a.status = 'QIKM Approve'
			ORDER BY rai.priority_score desc
						`, [indicatorId, year])
	}

	async getScore(risk_indicator_id: number) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT * FROM prioritization WHERE risk_assessment_indicator_id = $1 ORDER BY criteria_id asc`, [risk_indicator_id])
	}

	async getTop5Score(year: string) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT im.id, im.name, im.code, sum(rai.priority_score) as total
						FROM risk_assessment_indicator rai
						LEFT JOIN indicator_master im on rai.indicator_id = im.id
						LEFT JOIN risk_assessment ra on rai.risk_assessment_id = ra.id
						LEFT JOIN assessment a on ra.assessment_id = a.id
						WHERE a.year = $1
						GROUP by im.id, im.name, im.code
						HAVING sum(rai.priority_score) > 0
						ORDER BY total desc
						LIMIT 5`, [year])
	}

}
