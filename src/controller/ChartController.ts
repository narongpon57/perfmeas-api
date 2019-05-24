import { OrganizationUnitRepository } from './../repository/OrganizationUnitRepository';
import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express'


const getOURiskAssessment = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(OrganizationUnitRepository)
		const result = await repo.getOURiskAssessment(req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

const getOUPrioritization = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(OrganizationUnitRepository)
		const result = await repo.getOUPrioritization(req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

const getOUPerfMeas = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(OrganizationUnitRepository)
		const result = await repo.getOUPerfMeas(req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}

const getOUNotInProcess = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(OrganizationUnitRepository)
		const result = await repo.getOUNotInProcess(req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json({ e })
	}
}


export {
	getOURiskAssessment,
	getOUPrioritization,
	getOUPerfMeas,
	getOUNotInProcess
}