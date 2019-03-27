import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repository/UserRepository';
import * as md5 from 'md5'
import * as jwt from 'jsonwebtoken'

const secretKey = 'PerfMeas'

const login = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(UsersRepository)
		const user = repo.create()
		user.username = req.body.username
		user.password = md5(req.body.password)
		const result = await repo.findOne(user)

		if (!result) return res.status(404).json({ auth: false, token: null, user: result })

		let token = jwt.sign({ code: result.employee_code }, secretKey, { expiresIn: 86400 })
		return res.status(200).json({ auth: true, token, user: result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({})
	}

}

export {
	login
}