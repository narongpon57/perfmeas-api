import { EntityRepository, Repository, getConnection, getRepository } from "typeorm";
import { OrganizationUnit } from "../entity/OrganizationUnit";

@EntityRepository(OrganizationUnit)
export class OrganizationUnitRepository extends Repository<OrganizationUnit> {

	async findByCondition(code: string, name: string, type: string) {
		return await getRepository(OrganizationUnit)
			.createQueryBuilder("organization_unit")
			.leftJoinAndSelect("organization_unit.creator", "users")
			.leftJoinAndSelect("organization_unit.step1_approver", "users1")
			.where(`code like :code and name like :name and type like :type`, {
				code: `%${code}%`,
				name: `%${name}%`,
				type: `%${type}%`
			})
			.orderBy({
				'type': 'DESC',
				'code': 'ASC'
			})
			.getMany()
	}

	async findOrg(orgId: string) {
		return await getRepository(OrganizationUnit)
			.createQueryBuilder("organization_unit")
			.leftJoinAndSelect("organization_unit.creator", "users")
			.leftJoinAndSelect("organization_unit.step1_approver", "users1")
			.where("organization_unit.id = :org_id", {
				org_id: orgId,
			})
			.getMany()
	}

	async findByOrgId(id: string) {
		return await getRepository(OrganizationUnit)
			.createQueryBuilder("organization_unit")
			.leftJoinAndSelect("organization_unit.creator", "users")
			.leftJoinAndSelect("organization_unit.step1_approver", "users1")
			.where(`organization_unit.id = :id`, {
				id: id
			})
			.getOne()
	}

	async getCreatorApprover(assessmentId: string) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT u1.id as creator_id, u1.username as creator_username, u1.first_name || ' ' || u1.last_name as creator_name, u1.email as creator_email,
			u2.id as approver_id, u2.username as approver_username, u2.first_name || ' ' || u2.last_name as approver_name, u2.email as approver_email, ou.name as org_name
			FROM organization_unit ou
			LEFT JOIN assessment a on a.org_id = ou.id
			LEFT JOIN users u1 on u1.id = ou.creator_id
			LEFT JOIN users u2 on u2.id = ou.step1_approver_id
			WHERE a.id = $1`, [assessmentId])
	}

	async getOURiskAssessment(year: number) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT *
				FROM organization_unit ou
				WHERE ou.id in 
				(SELECT org_id FROM assessment WHERE year = $1 and status != 'QIKM Approve')`, [year])
	}

	async getOUNotInProcess(year: number) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT *
				FROM organization_unit ou
				WHERE ou.id not in (select org_id from assessment where year = $1)`, [year])
	}

	async getOUPerfMeas(year: number) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT DISTINCT ou.*
				FROM performance_measurement pm
				LEFT JOIN risk_assessment_indicator rai on rai.id = pm.risk_assessment_indicator_id
				LEFT JOIN risk_assessment ra on ra.id = rai.risk_assessment_id
				LEFT JOIN assessment a on a.id = ra.assessment_id
				LEFT JOIN organization_unit ou on ou.id = a.org_id
				WHERE a.year = $1`, [year])
	}

	async getOUPrioritization(year: number) {
		return await getConnection()
			.createEntityManager()
			.query(`SELECT DISTINCT ou.*
				FROM risk_assessment_indicator rai
				LEFT JOIN risk_assessment ra on ra.id = rai.risk_assessment_id
				LEFT JOIN assessment a on a.id = ra.assessment_id
				LEFT JOIN organization_unit ou on ou.id = a.org_id
				WHERE a.year = $1 and a.status = 'QIKM Approve' and rai.priority_score is null`, [year])
	}

}
