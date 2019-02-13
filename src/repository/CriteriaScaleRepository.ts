import { EntityRepository, Repository } from "typeorm";
import { CriteriaScale } from "../entity/CriteriaScale";

@EntityRepository(CriteriaScale)
export class CriteriaScaleRepository extends Repository<CriteriaScale> {}
