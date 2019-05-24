import { EntityRepository, Repository, getConnection, getRepository } from "typeorm";
import { Assessment } from "../entity/Assessment";

@EntityRepository(Assessment)
export class AssessmentRepository extends Repository<Assessment> {

	async updateStatus(id: number, status: string) {
		return await getConnection()
			.createQueryBuilder()
			.update(Assessment)
			.set({ status: status })
			.where("id = :id", { id: id })
			.execute()
	}

	async getWorkList(userId: string) {
		return await getRepository(Assessment)
			.createQueryBuilder("assessment")
			.leftJoinAndSelect("assessment.org", "organization_unit")
			.leftJoinAndSelect("organization_unit.creator", "users")
			.leftJoinAndSelect("organization_unit.step1_approver", "users1")
			.where("organization_unit.creator_id = :user_id or organization_unit.step1_approver_id = :user_id", {
				user_id: userId
			})
			.getMany()
	}

	async getAdminWorkList() {
		return await getRepository(Assessment)
			.createQueryBuilder("assessment")
			.leftJoinAndSelect("assessment.org", "organization_unit")
			.leftJoinAndSelect("organization_unit.creator", "users")
			.leftJoinAndSelect("organization_unit.step1_approver", "users1")
			.where("assessment.status in ('Waiting For Approve', 'Manager Approve')")
			.getMany()
	}

}
