import { EntityRepository, Repository, getRepository } from "typeorm";
import { PerformanceMeasurement } from "../entity/PerformanceMeasurement";

@EntityRepository(PerformanceMeasurement)
export class PerformanceMeasurementRepository extends Repository<PerformanceMeasurement> {
	async getPerfMeas(orgId: String, year: String) {
		return await getRepository(PerformanceMeasurement)
			.query(`SELECT perf.*, im.code, im.name, im.multiplier, im.divisor, im.formular, im.operator, im.unit, im.operator, im.target, im.unit, im.frequency, perf.id as perf_id, a.id as assessment_id
			FROM performance_measurement perf 
			LEFT JOIN risk_assessment_indicator rai ON perf.risk_assessment_indicator_id = rai.id 
			LEFT JOIN indicator_master im ON rai.indicator_id = im.id
			LEFT JOIN risk_assessment ra ON rai.risk_assessment_id = ra.id
			LEFT JOIN assessment a on ra.assessment_id = a.id
			WHERE a.org_id = $1 AND a.year = $2`, [orgId, year])
	}

	async getPerfIndicator(assessmentId: String) {
		return await getRepository(PerformanceMeasurement)
			.query(`SELECT im.*, rai.id as risk_assessment_indicator_id
			FROM assessment a 
			LEFT JOIN risk_assessment ra on a.id = ra.assessment_id
			LEFT JOIN risk_assessment_indicator rai on ra.id = rai.risk_assessment_id
			LEFT JOIN indicator_master im on im.id = rai.indicator_id
			WHERE a.id = $1`, [assessmentId])
	}


	async getPerfByIndicator(indicatorId: String, year: string) {
		return await getRepository(PerformanceMeasurement)
			.query(`SELECT perf.*, im.code, im.name, im.multiplier, im.divisor, im.formular, im.unit, 
					im.operator, im.target, im.frequency, perf.id as perf_id, a.id as assessment_id,
					ou.name as orgamization_name, ou.id as organization_id, ou.code as organization_code
					FROM performance_measurement perf 
					LEFT JOIN risk_assessment_indicator rai ON perf.risk_assessment_indicator_id = rai.id 
					LEFT JOIN indicator_master im ON rai.indicator_id = im.id
					LEFT JOIN risk_assessment ra ON rai.risk_assessment_id = ra.id
					LEFT JOIN assessment a on ra.assessment_id = a.id
					LEFT JOIN organization_unit ou on ou.id = a.org_id
					WHERE im.id = $1 AND a.year = $2`, [indicatorId, year])
	}
}