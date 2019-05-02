import { EntityRepository, Repository, getConnection } from "typeorm";
import { ExistingMeasure } from "../entity/ExistingMeasure";

@EntityRepository(ExistingMeasure)
export class ExistingMeasureRepository extends Repository<ExistingMeasure> {
	async deleteExistingMeasure(id: string, riskId: number) {
		return await getConnection()
			.createQueryBuilder()
			.delete()
			.from(ExistingMeasure)
			.where(`risk_id = :riskId and id NOT IN (${id})`, { riskId: riskId, id: id })
			.execute()
	}
}