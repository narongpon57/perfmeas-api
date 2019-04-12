import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { PerformanceMeasurementRepository } from '../repository/PerformanceMeasurementRepository';

const find = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PerformanceMeasurementRepository)
		const result = await repo.getPerfMeas(req.query.org_id, req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({})
	}
}

const create = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PerformanceMeasurementRepository)
		let obj = req.body
		const perfMeas = repo.create()
		perfMeas.id = obj.perf_id
		perfMeas.risk_assessment_indicator = obj.risk_assessment_indicator_id
		perfMeas.jan_multiplier_value = obj.jan_multiplier_value
		perfMeas.feb_multiplier_value = obj.feb_multiplier_value
		perfMeas.mar_multiplier_value = obj.mar_multiplier_value
		perfMeas.apr_multiplier_value = obj.apr_multiplier_value
		perfMeas.may_multiplier_value = obj.may_multiplier_value
		perfMeas.jun_multiplier_value = obj.jun_multiplier_value
		perfMeas.jul_multiplier_value = obj.jul_multiplier_value
		perfMeas.aug_multiplier_value = obj.aug_multiplier_value
		perfMeas.sep_multiplier_value = obj.sep_multiplier_value
		perfMeas.oct_multiplier_value = obj.oct_multiplier_value
		perfMeas.nov_multiplier_value = obj.nov_multiplier_value
		perfMeas.dec_multiplier_value = obj.dec_multiplier_value
		perfMeas.jan_divisor_value = obj.jan_divisor_value
		perfMeas.feb_divisor_value = obj.feb_divisor_value
		perfMeas.mar_divisor_value = obj.mar_divisor_value
		perfMeas.apr_divisor_value = obj.apr_divisor_value
		perfMeas.may_divisor_value = obj.may_divisor_value
		perfMeas.jun_divisor_value = obj.jun_divisor_value
		perfMeas.jul_divisor_value = obj.jul_divisor_value
		perfMeas.aug_divisor_value = obj.aug_divisor_value
		perfMeas.sep_divisor_value = obj.sep_divisor_value
		perfMeas.oct_divisor_value = obj.oct_divisor_value
		perfMeas.nov_divisor_value = obj.nov_divisor_value
		perfMeas.dec_divisor_value = obj.dec_divisor_value
		perfMeas.summary_result = obj.summary_result
		const result = await repo.save(perfMeas)

		return res.status(201).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({})
	}
}

const getIndicator = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PerformanceMeasurementRepository)
		const result = await repo.getPerfIndicator(req.query.assessmentId)
		return res.status(200).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({})
	}
}

export {
	find,
	create,
	getIndicator
}