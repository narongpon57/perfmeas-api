import { EntityRepository, Repository, getConnection } from "typeorm";
import { RiskAssessmentIndicator } from "../entity/RiskAssessmentIndicator";

@EntityRepository(RiskAssessmentIndicator)
export class RiskAssessmentIndicatorRepository extends Repository<RiskAssessmentIndicator> {

}