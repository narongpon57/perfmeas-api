import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { IndicatorMasterRepository } from '../repository/IndicatorMasterRepository';

const create = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(IndicatorMasterRepository)
		const lastRow = await repo.getLastRow()
		let newCode = 'R' + ('00' + (parseInt(lastRow.code.split('R')[1]) + 1)).slice(-3)
		let formular = ''
		const indicatorMaster = repo.create()
		indicatorMaster.code = newCode
		indicatorMaster.name = req.body.name
		indicatorMaster.description = req.body.description
		indicatorMaster.reason = req.body.reason
		indicatorMaster.indicator_type = req.body.indicator_type
		indicatorMaster.unit = req.body.unit
		indicatorMaster.formular = formular
		indicatorMaster.operator = req.body.operator
		indicatorMaster.target = req.body.target
		indicatorMaster.multiplier = req.body.multiplier
		indicatorMaster.divisor = req.body.divisor
		indicatorMaster.standard = req.body.standard
		indicatorMaster.measurement_domain = req.body.measurement_domain
		indicatorMaster.remark = req.body.remark
		indicatorMaster.start_date = req.body.start_date
		indicatorMaster.end_date = req.body.end_date
		indicatorMaster.is_active = req.body.is_active
		const result = await repo.save(indicatorMaster)
		return res.status(201).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findById = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(IndicatorMasterRepository)
		const result = await repo.findByIds(req.params.id)
		const [data] = result
		return res.status(200).json({ data })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findAll = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(IndicatorMasterRepository)
		const result = await repo.findAll()
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findCondition = async (req: Request, res: Response) => {
	try {
		const { name, indicator_type, standard, measurement_domain } = req.query
		const repo = getCustomRepository(IndicatorMasterRepository)
		const result = await repo.findByCondition(name, indicator_type, standard, measurement_domain)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const update = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(IndicatorMasterRepository)
		const indicatorMaster = repo.create()
		let formular = ''
		indicatorMaster.id = req.body.id
		indicatorMaster.name = req.body.name
		indicatorMaster.description = req.body.description
		indicatorMaster.reason = req.body.reason
		indicatorMaster.indicator_type = req.body.indicator_type
		indicatorMaster.unit = req.body.unit
		indicatorMaster.formular = formular
		indicatorMaster.operator = req.body.operator
		indicatorMaster.target = req.body.target
		indicatorMaster.multiplier = req.body.multiplier
		indicatorMaster.divisor = req.body.divisor
		indicatorMaster.standard = req.body.standard
		indicatorMaster.measurement_domain = req.body.measurement_domain
		indicatorMaster.remark = req.body.remark
		indicatorMaster.start_date = req.body.start_date
		indicatorMaster.end_date = req.body.end_date
		indicatorMaster.is_active = req.body.is_active
		const result = await repo.save(indicatorMaster)
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