import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { AssessmentRepository } from '../repository/AssessmentRepository'
import { RiskAssessmentRepository } from '../repository/RiskAssessmentRepository';
import { RiskAssessmentIndicatorRepository } from '../repository/RiskAssessmentIndicatorRepository';

const create = async (req: Request, res: Response) => {
  try {

    const assessment = await createAssessment({ org_id: req.body.org.id, year: req.body.year }, req.body.status)
    const riskAssessment = await createRiskAssessment({ risk_assessments: req.body.assessment.risk_assessment }, assessment.id)
    return res.status(201).json({ result: assessment })
  } catch (e) {
    return res.status(500).json(e)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const repoRiskAssessment = getCustomRepository(RiskAssessmentRepository)
    const currentRiskAssessment = await repoRiskAssessment.find({ assessment_id: req.body.assessment.id })
    for (let item of currentRiskAssessment) {
      const repoRiskIndicator = getCustomRepository(RiskAssessmentIndicatorRepository)
      const currentRiskIndicator = await repoRiskIndicator.find({ risk_assessment_id: item.id })
      const removeRiskIndicator = await repoRiskIndicator.remove(currentRiskIndicator)
    }
    const removeRiskAssessment = await repoRiskAssessment.remove(currentRiskAssessment)

    const riskAssessment = await createRiskAssessment({ risk_assessments: req.body.assessment.risk_assessment }, req.body.assessment.id)
    const updateAssessmentStatus = await updateRiskAssessment(req.body.status, req.body.assessment.id)
    return res.status(201).json({})
  } catch (e) {
    return res.status(500).json(e)
  }
}

const getRiskAssessment = async (req: Request, res: Response) => {
  try {
    const repo = getCustomRepository(RiskAssessmentRepository)
    const result = await repo.getAssessment(req.query.org_id, req.query.year)
    return res.status(200).json({ result })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ e })
  }
}

const getAssessment = async (req: Request, res: Response) => {
  try {
    const repo = getCustomRepository(AssessmentRepository)
    const result = repo.findByIds(req.query.id)
    return res.status(200).json({ result })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ e })
  }
}

const getWorkList = async (req: Request, res: Response) => {
  try {
    const repo = getCustomRepository(AssessmentRepository)
    const result = await repo.getWorkList(req.query.user_id)
    return res.status(200).json({ result })
  } catch (e) {
    return res.status(500).json({ e })
  }
}

const createAssessment = async (data, status) => {
  try {
    const repo = getCustomRepository(AssessmentRepository)
    const assessment = repo.create()
    assessment.org = data.org_id
    assessment.year = data.year
    assessment.status = status
    assessment.created_at = new Date()
    const result = await repo.save(assessment)
    return result
  } catch (e) {
    throw new Error(e)
  }
}

const createRiskAssessment = async (data, assessmentId) => {
  try {
    const repo = getCustomRepository(RiskAssessmentRepository)
    for (let risk of data.risk_assessments) {
      const riskAssessment = repo.create()
      riskAssessment.risk = risk.risk.id
      riskAssessment.probability = parseInt(risk.probability)
      riskAssessment.impact = parseInt(risk.impact)
      riskAssessment.risk_score = risk.impact * risk.probability
      riskAssessment.mitigation_strategy = risk.mitigation_strategy
      riskAssessment.assessment_id = assessmentId
      const result = await repo.save(riskAssessment)
      await createRiskAssessmentIndicator(risk.risk_indicator, result.id)
    }
    return true
  } catch (e) {
    throw new Error(e)
  }
}

const createRiskAssessmentIndicator = async (risk_indicator, risk_assessment_id) => {
  try {
    const repo = getCustomRepository(RiskAssessmentIndicatorRepository)
    for (let indicator of risk_indicator) {
      const RiskAssessmentIndicator = repo.create()
      RiskAssessmentIndicator.risk_assessment_id = risk_assessment_id
      RiskAssessmentIndicator.indicator = indicator.indicator.id
      await repo.save(RiskAssessmentIndicator)
    }
    return true
  } catch (e) {
    throw new Error(e)
  }
}

const updateRiskAssessment = async (status: string, assessmentId: number) => {
  try {
    const repo = getCustomRepository(AssessmentRepository)
    const assessment = repo.create()
    assessment.id = assessmentId
    assessment.status = status
    const result = await repo.save(assessment)
    return result
  } catch (e) {
    throw new Error(e)
  }
}

export {
  create,
  update,
  getRiskAssessment,
  getAssessment,
  getWorkList
}
