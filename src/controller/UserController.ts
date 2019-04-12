import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repository/UserRepository';


const findById = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(UsersRepository)
		const result = await repo.findByIds(req.params.id)
		const [data] = result
		return res.status(200).json({ data })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findAll = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(UsersRepository)
		const result = await repo.findAll()
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const findCondition = async (req: Request, res: Response) => {
	try {
		const { code = '', name = '' } = req.query
		const repo = getCustomRepository(UsersRepository)
		const result = await repo.findByCondition(code, name)
		return res.status(200).json({ result })
	} catch (e) {
		return res.status(500).json(e)
	}
}

const update = async (req: Request, res: Response) => {
	try {
	} catch (e) {
		return res.status(500).json(e)
	}
}

const deleteById = async (req: Request, res: Response) => {
}

export {
	findById,
	findAll,
	findCondition,
	update,
	deleteById
}