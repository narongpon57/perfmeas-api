import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { CriteriaRepository } from '../repository/CritetiaRepository'
import { PrioritizationRepository } from '../repository/PrioritizationRepository'
import { RiskAssessmentIndicatorRepository } from '../repository/RiskAssessmentIndicatorRepository';

const create = async (req: Request, res: Response) => {
	try {
		const riskIndicatorRepo = getCustomRepository(RiskAssessmentIndicatorRepository)
		const prioritizationRepo = getCustomRepository(PrioritizationRepository)
		for (let item of req.body.prioritization) {
			const riskIndicator = riskIndicatorRepo.create()
			riskIndicator.id = item.risk_assessment_indicator_id
			riskIndicator.priority_score = item.priority_score
			await riskIndicatorRepo.save(riskIndicator)
			for (let score of item.prioritization_score) {
				const prioritization = prioritizationRepo.create()
				prioritization.id = score.prioritization_id
				prioritization.criteria_id = score.criteria_id
				prioritization.risk_assessment_indicator_id = item.risk_assessment_indicator_id
				prioritization.score = score.score
				await prioritizationRepo.save(prioritization)
			}
		}
		return res.status(201).json({ result: true })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

const getCriteria = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(CriteriaRepository)
		const result = await repo.getCriteria()
		return res.status(200).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ e })
	}
}

const getPrioritization = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PrioritizationRepository)
		const result = await repo.getPrioritization(req.query.org_id, req.query.year)
		console.log(result)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

const getScore = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PrioritizationRepository)
		const result = await repo.getScore(req.query.id)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

export {
	create,
	getCriteria,
	getPrioritization,
	getScore
}