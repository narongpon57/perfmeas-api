import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { RiskMasterRepository } from '../repository/RiskMasterRepository';
import { ExistingMeasureRepository } from '../repository/ExistingMeasureRepository';

const create = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskMasterRepository)
		const lastRow = await repo.getLastRow()
		let newCode = 'R0001'
		if (lastRow) {
			newCode = 'R' + ('00' + (parseInt(lastRow.code.split('R')[1]) + 1)).slice(-3)
		}
		const riskMaster = repo.create()
		riskMaster.code = newCode
		riskMaster.description = req.body.description
		riskMaster.risk_type = req.body.risk_type
		riskMaster.risk_group = req.body.risk_group
		riskMaster.identified = req.body.identified
		riskMaster.problem_area = req.body.problem_area
		riskMaster.is_active = req.body.is_active
		const result = await repo.save(riskMaster)
		if (req.body.existing_risk !== undefined && req.body.existing_risk.length) {
			await createExistingMeasure({ existingMeasure: req.body.existing_risk, riskId: result.id })
		}
		return res.status(201).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json(e)
	}
}

const findById = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskMasterRepository)
		const result = await repo.getRiskWithExisitingMeasure(req.params.id)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findAll = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskMasterRepository)
		const result = await repo.findAll()
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findCondition = async (req: Request, res: Response) => {
	try {
		const { risk_group, risk_type, identified, problem_area } = req.query
		const repo = getCustomRepository(RiskMasterRepository)
		let result = null
		if (req.query.is_master) {
			result = await repo.findByConditionMaster(risk_group, risk_type, identified, problem_area)
		} else {
			result = await repo.findByCondition(risk_group, risk_type, identified, problem_area)
		}
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const update = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskMasterRepository)
		const riskMaster = repo.create()
		riskMaster.id = req.body.id
		riskMaster.code = req.body.code
		riskMaster.description = req.body.description
		riskMaster.risk_type = req.body.risk_type
		riskMaster.risk_group = req.body.risk_group
		riskMaster.identified = req.body.identified
		riskMaster.problem_area = req.body.problem_area
		riskMaster.is_active = req.body.is_active
		const result = await repo.save(riskMaster)
		if (req.body.existing_risk !== undefined) {
			await updateExistingMeasure({ existingMeasure: req.body.existing_risk, riskId: req.body.id })
		}
		return res.status(201).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const deleteById = async (req: Request, res: Response) => {
}

const createExistingMeasure = async (obj) => {
	try {
		const existingRepo = getCustomRepository(ExistingMeasureRepository)
		for (let e of obj.existingMeasure) {
			const existingMeasure = existingRepo.create()
			existingMeasure.id = e.id
			existingMeasure.risk = obj.riskId
			existingMeasure.indicator = e.indicator.id
			await existingRepo.save(existingMeasure)
		}
		return true
	} catch (e) {
		console.log(e)
		throw new Error(e)
	}
}

const updateExistingMeasure = async (obj) => {
	try {
		let queryId = ''
		const existingRepo = getCustomRepository(ExistingMeasureRepository)
		const existingId = obj.existingMeasure.filter(o => {
			return o.id !== null
		}).map(ex => {
			return ex.id
		}).join(',')
		if (existingId !== '') {
			queryId = `and id NOT IN (${existingId})`
		}
		await existingRepo.deleteExistingMeasure(queryId, obj.riskId)
		for (let e of obj.existingMeasure) {
			const existingMeasure = existingRepo.create()
			existingMeasure.id = e.id
			existingMeasure.risk = obj.riskId
			existingMeasure.indicator = e.indicator.id
			await existingRepo.save(existingMeasure)
		}
		return true
	} catch (e) {
		throw new Error(e)
	}
}

export {
	create,
	findById,
	findAll,
	findCondition,
	update,
	deleteById
}