import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { OrganizationUnitRepository } from '../repository/OrganizationUnitRepository';

const findCondition = async (req: Request, res: Response) => {
	try {
		const { code = '', name = '', type = '' } = req.query
		const repo = getCustomRepository(OrganizationUnitRepository)
		const result = await repo.findByCondition(code, name, type)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findById = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(OrganizationUnitRepository)
		const result = await repo.findByOrgId(req.params.id)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const update = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(OrganizationUnitRepository)
		const ou = repo.create()
		ou.id = req.body.id
		ou.creator = req.body.creator.id
		ou.step1_approver = req.body.step1_approver.id
		const result = await repo.save(ou)
		return res.status(201).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json(e)
	}
}

export {
	findCondition,
	findById,
	update
}