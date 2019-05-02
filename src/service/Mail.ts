import { getCustomRepository } from "typeorm";
import { OrganizationUnitRepository } from "../repository/OrganizationUnitRepository";
import { UsersRepository } from "../repository/UserRepository";

export const notification = async (assessmentId: string, isAdmin: number, status: string, approveBy: string) => {
	let result, from, to
	const orgRepo = getCustomRepository(OrganizationUnitRepository)
	const userRepo = getCustomRepository(UsersRepository)
	if (status === 'Initial') {
		const result = await orgRepo.getCreatorApprover(assessmentId)[0]
		await sendMail(result.org_name, result.creator_name, status, result.approver_name)
	} else if (status === 'Manager Review') {
		const result = await orgRepo.getCreatorApprover(assessmentId)[0]
		await sendMail(result.org_name, result.approver_name, status, result.creator_name)
	} else if (status === 'Manager Approve') {
		const admins = await userRepo.getAllAdmin()
		const result = await orgRepo.getCreatorApprover(assessmentId)[0]
		await sendMail(result.org_name, result.approver_name, status, result.creator_name)
	} else if (status === 'QIKM Review') {
		const admin = await userRepo.getAdmin(approveBy)[0]
		const result = await orgRepo.getCreatorApprover(assessmentId)[0]
		await sendMail(result.org_name, admin.admin_name, status, result.creator_name)
	} else if (status === 'QIKM Approve') {

	} else if (status === 'Waiting For Approve') {

	}


	console.log(result[0])
}


const sendMail = async (orgName: string, owner: string, status: string, receiverName: string) => {
	console.log(orgName, owner, status, receiverName)
}