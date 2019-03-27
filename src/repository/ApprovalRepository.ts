import { EntityRepository, Repository, getConnection, EntityManager } from "typeorm";
import { Approval } from "../entity/Approval";

@EntityRepository(Approval)
export class ApprovalRepository extends Repository<Approval> {
	async findByCondition(orgId: number, year: string) {
		return await getConnection()
			.createEntityManager()
			.query(`
			SELECT a.status, a.description, to_char(a.approved_at, 'dd/mm/yyyy HH24:MI') as approved_at_dateformat, a.approved_at, a.step2_approver_id, concat(u.first_name, ' ', u.last_name) as step2_approver_name, ou.step1_approver_id, concat(u1.first_name, ' ', u1.last_name) as step1_approver_name
			FROM Approval a 
			LEFT JOIN Users u on u.id = a.step2_approver_id
			LEFT JOIN Assessment a1 on a1.id = a.assessment_id
			LEFT JOIN Organization_Unit ou on ou.id = a1.org_id
			LEFT JOIN Users u1 on u1.id = ou.step1_approver_id
			WHERE a1.org_id = $1 and a1.year = $2
			`, [orgId, year])
	}

	async finds(id: number) {
		return await getConnection()
			.createEntityManager()
			.query(`
			SELECT a.status, a.description, to_char(a.approved_at, 'dd/mm/yyyy HH24:MI') as approved_at_dateformat, a.approved_at, a.step2_approver_id, concat(u.first_name, ' ', u.last_name) as step2_approver_name, ou.step1_approver_id, concat(u1.first_name, ' ', u1.last_name) as step1_approver_name
			FROM Approval a 
			LEFT JOIN Users u on u.id = a.step2_approver_id
			LEFT JOIN Assessment a1 on a1.id = a.assessment_id
			LEFT JOIN Organization_Unit ou on ou.id = a1.org_id
			LEFT JOIN Users u1 on u1.id = ou.step1_approver_id
			WHERE a.id = $1
			`, [id])
	}
}