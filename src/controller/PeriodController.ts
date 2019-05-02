import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { PeriodRepository } from '../repository/PeriodRepository';

const create = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PeriodRepository)
		const period = repo.create()
		period.name = req.body.name
		period.type = req.body.type
		period.year = req.body.year
		period.status = req.body.status
		period.date_from = req.body.date_from
		period.date_to = req.body.date_to
		period.published_date = req.body.published_date
		const result = await repo.save(period)
		return res.status(201).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findById = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PeriodRepository)
		const result = await repo.findByIds(req.params.id)
		const [data] = result
		return res.status(200).json({ data })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findAll = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PeriodRepository)
		const result = await repo.findAll()
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findCondition = async (req: Request, res: Response) => {
	try {
		const { type, name, year, status } = req.query
		let query = ''
		if (year !== '') {
			query = `and year=${year}`
		}
		const repo = getCustomRepository(PeriodRepository)
		const result = await repo.findByCondition(type, query, name, status)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const update = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PeriodRepository)
		const period = repo.create()
		period.id = req.body.id
		period.name = req.body.name
		period.type = req.body.type
		period.year = req.body.year
		period.status = req.body.status
		period.date_from = req.body.date_from
		period.date_to = req.body.date_to
		period.published_date = req.body.published_date
		const result = await repo.save(period)
		return res.status(201).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const deleteById = async (req: Request, res: Response) => {
}

const getOnPeriod = async (req: Request, res: Response) => {
	try {
		const { type, year } = req.query
		let query = ''
		if (year !== '') {
			query = `and year=${year}`
		}
		const repo = getCustomRepository(PeriodRepository)
		const result = await repo.getOnPeriod(type, year)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

export {
	create,
	findById,
	findAll,
	findCondition,
	update,
	deleteById,
	getOnPeriod
}