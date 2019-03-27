import { EntityRepository, Repository, getRepository } from "typeorm";
import { Criteria } from "../entity/Criteria";

@EntityRepository(Criteria)
export class CriteriaRepository extends Repository<Criteria> {
	async getCriteria() {
		return await getRepository(Criteria)
			.createQueryBuilder("criteria")
			.leftJoinAndSelect("criteria.criteriaScales", "criteriascale")
			.getMany()
	}
}