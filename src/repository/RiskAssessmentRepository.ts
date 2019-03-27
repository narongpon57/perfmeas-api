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
}