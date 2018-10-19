import { EntityRepository, Repository } from "typeorm";
import { Criteria } from "../entity/Criteria";

@EntityRepository(Criteria)
export class CriteriaRepository extends Repository<Criteria> {}
