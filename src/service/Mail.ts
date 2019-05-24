import { getCustomRepository } from "typeorm";
import { OrganizationUnitRepository } from "../repository/OrganizationUnitRepository";
import { UsersRepository } from "../repository/UserRepository";
import * as nodemailer from 'nodemailer'

export const notification = async (assessmentId: string, isAdmin: number, status: string, approveBy: string) => {
	const orgRepo = getCustomRepository(OrganizationUnitRepository)
	const userRepo = getCustomRepository(UsersRepository)
    const org = await orgRepo.getCreatorApprover(assessmentId)
	if (status === 'Initial') {
		const result = org[0]
		await send(result.org_name, result.creator_name, status, result.approver_name, result.approver_email)
	} else if (status === 'Manager Review') {
		const result = org[0]
        await send(result.org_name, result.creator_name, status, result.creator_name, result.creator_email)
	} else if (status === 'Manager Approve') {
		const admins = await userRepo.getAllAdmin()
        const result = org[0]
        for (let a of admins) {
            await send(result.org_name, result.creator_name, status, a.admin_name, a.email)
        }
	} else if (status === 'QIKM Review') {
		const result = org[0]
        await send(result.org_name, result.creator_name, status, result.approver_name, result.approver_email)
        await send(result.org_name, result.creator_name, status, result.creator_name, result.creator_email)
	} else if (status === 'QIKM Approve') {
        const result = org[0]
        await send(result.org_name, result.creator_name, status, result.approver_name, result.approver_email)
        await send(result.org_name, result.creator_name, status, result.creator_name, result.creator_email)
	} else if (status === 'Waiting For Approve') {
        const admins = await userRepo.getAllAdmin()
        const result = org[0]
        for (let a of admins) {

            await send(result.org_name, result.creator_name, status, a.admin_name, a.email)
        }
	}
	return true
}

const send = async (orgName: string, owner: string, status: string, receiverName: string, toEmail: string) => {
	console.log(orgName, owner, status, receiverName, toEmail)

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'narongpon.su@gmail.com',
			pass: 'nono123n'
		}
	})

	const mailOptions = {
		from: 'no-reply-performance-measurement@gmail.com',
		to: toEmail,
		subject: 'Performance Measurement Notification Mail',
		html: emailTemplate(orgName, owner, status, receiverName)
	}


	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err)
			return err
		}
		else {
			console.log(info)
			return info
		}
	})
}

const emailTemplate = (org: string = null, owner: string = null, status: string = null, receiverName: string = null) => {
    let msg = 'Please review Risk assessment from information and submit.'
    if (status === 'QIKM Approve') {
        msg = 'Risk assessment was approved.'
    }
	return `<!DOCTYPE html>
<html lang="en" style="box-sizing:border-box;font-family:Verdana,sans-serif;font-size:15px;line-height:1.5;overflow-x:hidden;" >
<head style="box-sizing:inherit;" >
    <meta charset="UTF-8" style="box-sizing:inherit;" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0" style="box-sizing:inherit;" >
    <meta http-equiv="X-UA-Compatible" content="ie=edge" style="box-sizing:inherit;" >
    <style style="box-sizing:inherit;" >
        .w3-theme-d4 {color:#fff !important; background-color:#0066FF !important}
        .w3-theme-light {color:#000 !important; background-color:#f5f7f8 !important}

html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}


html,body{font-family:Verdana,sans-serif;font-size:15px;line-height:1.5}html{overflow-x:hidden}
.w3-bar{width:100%;overflow:hidden}.w3-center .w3-bar{display:inline-block;width:auto}
.w3-bar .w3-bar-item{padding:8px 16px;float:left;width:auto;border:none;display:block;outline:0}
.w3-bar .w3-button{white-space:normal}
.w3-bar-block .w3-bar-item{width:100%;display:block;padding:8px 16px;text-align:left;border:none;white-space:normal;float:none;outline:0}
.w3-bar-block.w3-center .w3-bar-item{text-align:center}.w3-block{display:block;width:100%}
.w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row:after,.w3-row:before,.w3-row-padding:after,.w3-row-padding:before,
.w3-content{max-width:980px;margin:auto}.w3-rest{overflow:hidden}
.w3-row-padding,.w3-row-padding>.w3-half,.w3-row-padding>.w3-third,.w3-row-padding>.w3-twothird,.w3-row-padding>.w3-threequarter,.w3-row-padding>.w3-quarter,.w3-row-padding>.w3-col{padding:0 8px}
.w3-container,.w3-panel{padding:0.01em 40px}.w3-panel{margin-top:0px;margin-bottom:16px}
.w3-card,.w3-card-2{box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)}
.w3-white,.w3-hover-white:hover{color:#000!important;background-color:#fff!important}
table{
    border: 1px solid rgb(189, 189, 189);
    border-collapse: collapse;
}
</style>
</head>
    <body class="w3-theme-light" style="box-sizing:inherit;font-family:Verdana,sans-serif;font-size:15px;line-height:1.5;color:#000 !important;background-color:#f5f7f8 !important;" >
        <div class="w3-container w3-content" style="box-sizing:inherit;margin-top:10px;max-width:980px;margin-bottom:auto;margin-right:auto;margin-left:auto;padding-top:0.01em;padding-bottom:0.01em;padding-right:40px;padding-left:40px;" >
            <div class="w3-bar w3-large w3-theme-d4" style="box-sizing:inherit;color:#fff !important;background-color:#0066FF !important;width:100%;overflow:hidden;" >
                <span class="w3-bar-item" style="box-sizing:inherit;font-size:18px;padding-top:8px;padding-bottom:8px;padding-right:16px;padding-left:16px;float:left;width:auto;border-style:none;display:block;outline-color:0;" > <b style="box-sizing:inherit;" >Performance Measurement</b> </span>
            </div>
            <div class="w3-panel w3-white w3-card w3-display-container" style="box-sizing:inherit;padding-top:0.01em;padding-bottom:0.01em;padding-right:40px;padding-left:40px;margin-top:0px;margin-bottom:16px;box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);color:#000!important;background-color:#fff!important;" >
                <p style="box-sizing:inherit;font-size:18px;" ><b style="box-sizing:inherit;" >Performance Measurement Notification Mail Alert</b></p>
                <div style="box-sizing:inherit;margin-left:30px;" >
                    <table width="100%" style="box-sizing:inherit;border-width:1px;border-style:solid;border-color:rgb(189, 189, 189);border-collapse:collapse;" >
                        <tbody style="box-sizing:inherit;" >
                            <tr style="box-sizing:inherit;" >
                                <td style="box-sizing:inherit;" >
                                    Year
                                </td>
                                <td style="box-sizing:inherit;" >
                                    ${new Date().getFullYear()}
                                </td>
                            </tr>
                            <tr style="box-sizing:inherit;" >
                                <td style="box-sizing:inherit;" >
                                    Organization Name
                                </td>
                                <td style="box-sizing:inherit;" >
                                    ${org}
                                </td>
                            </tr>
                            <tr style="box-sizing:inherit;" >
                                <td style="box-sizing:inherit;" >
                                    Owner
                                </td>
                                <td style="box-sizing:inherit;" >
                                    ${owner}
                                </td>
                            </tr>
                            <tr style="box-sizing:inherit;" >
                                <td style="box-sizing:inherit;" >
                                    Status
                                </td>
                                <td style="box-sizing:inherit;" >
                                    ${status}
                                </td>
                            </tr>
                           <!-- <tr style="box-sizing:inherit;" >
                                <td style="box-sizing:inherit;color:white;" >.</td>
                                <td style="box-sizing:inherit;color:white;" >.</td>
                            </tr> -->
                        </tbody>
                    </table><br style="box-sizing:inherit;" >
                    <table width="100%" style="box-sizing:inherit;border-width:1px;border-style:solid;border-color:rgb(189, 189, 189);border-collapse:collapse;" >
                            <tbody style="box-sizing:inherit;" >
                                <tr style="box-sizing:inherit;" >
                                    <td style="box-sizing:inherit;" >
                                        Dear Khun ${receiverName}
                                    </td>
                                </tr>
                                <tr style="box-sizing:inherit;" >
                                    <td style="box-sizing:inherit;" >
                                       <span style="box-sizing:inherit;margin-left:30px;" >${msg}</span>
                                    </td>
                                </tr>
                                <tr style="box-sizing:inherit;" >
                                    <td style="box-sizing:inherit;" >
                                        Best regards,
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </div>
                <p style="box-sizing:inherit;color:#696969;" ><b style="box-sizing:inherit;" >Click the following link to open form : <a href="http://localhost:8080/worklist" style="box-sizing:inherit;" ><u style="box-sizing:inherit;color:black;" >Worklist Item</u></a> </b> </p>
                <!-- <p style="box-sizing:inherit;color:#ff0000;" ><b style="box-sizing:inherit;" >If you can't click hyperlink in your email message please copy paste the following link in your browser : <u style="box-sizing:inherit;color:black;" >http://{{url}}/perfmeas/myworklist.html</u></b> </p> -->
            </div>
            <p style="box-sizing:inherit;color:#696969;" >*** This is an automatically generated email, please do not reply.***</p>
        </div>
    </body>
</html>`
}