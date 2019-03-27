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
			WHERE a.org_id = $1 and a.year = $2
			ORDER BY rai.priority_score desc, im.code asc
			`, [org_id, year])
	}

	async getScore(risk_indicator_id: number) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT * FROM prioritization WHERE risk_assessment_indicator_id = $1 ORDER BY criteria_id asc`, [risk_indicator_id])
	}

}
