import { EntityRepository, Repository, getConnection, getRepository } from "typeorm";
import { RiskAssessment } from "../entity/RiskAssessment";
import { Assessment } from "../entity/Assessment";
import { RiskMaster } from "../entity/RiskMaster";

@EntityRepository(RiskAssessment)
export class RiskAssessmentRepository extends Repository<RiskAssessment> {
	async getAssessment(orgId: string, year: string) {
		return await getRepository(Assessment)
			.createQueryBuilder("assessment")
			.leftJoinAndSelect("assessment.risk_assessment", "risk_assessment")
			.leftJoinAndSelect("assessment.org", "organization_unit")
			.leftJoinAndSelect("organization_unit.creator", "users")
			.leftJoinAndSelect("organization_unit.step1_approver", "users1")
			.leftJoinAndSelect("risk_assessment.risk_indicator", "risk_assessment_indicator")
			.leftJoinAndSelect("risk_assessment.risk", "risk_master")
			.leftJoinAndSelect("risk_assessment_indicator.indicator", "indicator_master")
			.where("assessment.org_id = :org_id and assessment.year = :year", {
				org_id: orgId,
				year: year
			})
			.getMany()
	}

	async getExportData(orgId: string, year: string) {
		return await getConnection()
			.createEntityManager()
			.query(`
				SELECT ra.*, rm.*, im.*
				FROM risk_assessment ra
				LEFT JOIN risk_master rm on rm.id = ra.risk_id
				LEFT JOIN assessment a on a.id = ra.assessment_id
				LEFT JOIN risk_assessment_indicator rai on rai.risk_assessment_id = ra.id
				LEFT JOIN indicator_master im on im.id = rai.indicator_id
				WHERE a.org_id = $1 AND a.year = $2`, [orgId, year])
	}
}