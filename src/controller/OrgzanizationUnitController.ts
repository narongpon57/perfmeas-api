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

export {
	findCondition
}