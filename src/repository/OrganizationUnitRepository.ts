import { EntityRepository, Repository, getConnection } from "typeorm";
import { OrganizationUnit } from "../entity/OrganizationUnit";

@EntityRepository(OrganizationUnit)
export class OrganizationUnitRepository extends Repository<OrganizationUnit> {

	async findByCondition(code: string, name: string, type: string) {
		return await getConnection()
			.createQueryBuilder()
			.select('orgzanization_unit')
			.from(OrganizationUnit, 'orgzanization_unit')
			.where(`code like :code and name like :name and type like :type`, {
				code: `%${code}%`,
				name: `%${name}%`,
				type: `%${type}%`
			})
			.orderBy('name', 'ASC')
			.getMany()
	}

}
