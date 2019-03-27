import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { RiskMasterRepository } from '../repository/RiskMasterRepository';

const create = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskMasterRepository)
		const lastRow = await repo.getLastRow()
		let newCode = 'R' + ('00' + (parseInt(lastRow.code.split('R')[1]) + 1)).slice(-3)
		const riskMaster = repo.create()
		riskMaster.code = newCode
		riskMaster.description = req.body.description
		riskMaster.risk_type = req.body.risk_type
		riskMaster.risk_group = req.body.risk_group
		riskMaster.identified = req.body.identified
		riskMaster.problem_area = req.body.problem_area
		riskMaster.is_active = req.body.is_active
		const result = await repo.save(riskMaster)
		return res.status(201).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findById = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskMasterRepository)
		const result = await repo.findByIds(req.params.id)
		const [data] = result
		return res.status(200).json({ data })
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
		const result = await repo.findByCondition(risk_group, risk_type, identified, problem_area)
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
		return res.status(201).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const deleteById = async (req: Request, res: Response) => {
}

export {
	create,
	findById,
	findAll,
	findCondition,
	update,
	deleteById
}