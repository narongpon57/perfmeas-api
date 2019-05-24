import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { CriteriaRepository } from '../repository/CritetiaRepository'
import { PrioritizationRepository } from '../repository/PrioritizationRepository'
import { RiskAssessmentIndicatorRepository } from '../repository/RiskAssessmentIndicatorRepository';
import * as _ from 'lodash'
import { PerformanceMeasurementRepository } from '../repository/PerformanceMeasurementRepository';

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
				if (score.prioritization_id) {
					prioritization.id = score.prioritization_id
					prioritization.score = score.score
				} else {
					prioritization.criteria_id = score.criteria_id
					prioritization.risk_assessment_indicator_id = item.risk_assessment_indicator_id
					prioritization.score = score.score
				}
				await prioritizationRepo.save(prioritization)
			}
		}

		if (!req.body.isDraft) {
			const topScore = req.body.prioritization.reduce((max, obj) => {
				return obj.priority_score > max ? obj.priority_score : max
			}, 0)
			const targetPerfMeas = req.body.prioritization.filter(obj => {
				return obj.priority_score === topScore
			})
			// const maxPiority = _.maxBy(req.body.prioritization, 'priority_score')
			const perfMeasRepo = getCustomRepository(PerformanceMeasurementRepository)
			for (let perf of targetPerfMeas) {
				const perfMeas = perfMeasRepo.create()
				perfMeas.risk_assessment_indicator = perf.risk_assessment_indicator_id
				await perfMeasRepo.save(perfMeas)
			}
		}

		return res.status(201).json({ result: true })
	} catch (e) {
		console.log(e)
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

const getTop5Score = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PrioritizationRepository)
		const result = await repo.getTop5Score(req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

export {
	create,
	getCriteria,
	getPrioritization,
	getScore,
	getTop5Score
}