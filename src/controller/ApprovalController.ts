import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { ApprovalRepository } from '../repository/ApprovalRepository'
import { AssessmentRepository } from '../repository/AssessmentRepository'
import { notification } from '../service/Mail';

const create = async (req: Request, res: Response) => {
	try {
		const { status, description, assessment_id, approve_by, is_admin } = req.body
		const approvalrepo = getCustomRepository(ApprovalRepository)
		const assessmentRepo = getCustomRepository(AssessmentRepository)
		const approval = approvalrepo.create()
		approval.status = status
		approval.description = description
		approval.assessment = assessment_id
		if (is_admin) {
			approval.created_by = approve_by
		}
		const noti = notification(assessment_id, is_admin, status, approve_by)
		const approve = await approvalrepo.save(approval)
		await assessmentRepo.updateStatus(assessment_id, status)
		const result = await approvalrepo.finds(approve.id)
		return res.status(201).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ e })
	}
}

const getApproval = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(ApprovalRepository)
		const result = await repo.findByCondition(req.query.org_id, req.query.year)
		return res.status(200).json({ result })
	} catch (e) {
		console.log(e)
		return res.status(500).json({ e })
	}
}

export {
	create,
	getApproval
}