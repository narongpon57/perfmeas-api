import { EntityRepository, Repository, getConnection, getRepository } from "typeorm";
import { OrganizationUnit } from "../entity/OrganizationUnit";

@EntityRepository(OrganizationUnit)
export class OrganizationUnitRepository extends Repository<OrganizationUnit> {

	async findByCondition(code: string, name: string, type: string) {
		// return await getConnection()
		// 	.createQueryBuilder()
		// 	.select('orgzanization_unit')
		// 	.from(OrganizationUnit, 'orgzanization_unit')
		// 	.where(`code like :code and name like :name and type like :type`, {
		// 		code: `%${code}%`,
		// 		name: `%${name}%`,
		// 		type: `%${type}%`
		// 	})
		// 	.orderBy('name', 'ASC')
		// 	.getMany()
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

}
