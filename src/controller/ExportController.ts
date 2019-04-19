import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { RiskAssessmentRepository } from '../repository/RiskAssessmentRepository';
// import * as excel from 'excel4node'
import * as Excel from 'exceljs'
import * as path from 'path'
import * as fs from 'fs'
import { PrioritizationRepository } from '../repository/PrioritizationRepository';
import { CriteriaRepository } from '../repository/CritetiaRepository';

const riskAssessment = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskAssessmentRepository)
		const result = await repo.getAssessment(req.query.org_id, req.query.year)
		const date = new Date()
		const filePath = `${path.resolve()}/tmp/RiskAssessment_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
		const options = {
			filename: filePath,
			useStyles: true,
			useSharedStrings: true
		}
		let workbook = new Excel.stream.xlsx.WorkbookWriter(options);
		let worksheet = workbook.addWorksheet('RiskAssessment')
		worksheet.columns = [
			{
				header: 'รหัสความเสี่ยง',
				key: 'risk_code',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					font: {
						size: 14,
						bold: true
					}
				}
			},
			{
				header: 'ประเภทความเสี่ยง',
				key: 'risk_type',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'ปัญหาหรือกิจกรรมที่เป็นความเสี่ยง',
				key: 'problem_area',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'รายการความเสี่ยง',
				key: 'identified',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'คำอธิบาย',
				key: 'description',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'โอกาสเกิดเหตุ',
				key: 'probability',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle',
						horizontal: 'center'
					}
				}
			},
			{
				header: 'ความรุนแรงของผลกระทบ',
				key: 'impact',
				width: 25,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle',
						horizontal: 'center'
					}
				}
			},
			{
				header: 'คะนนความเสี่ยง',
				key: 'risk_score',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle',
						horizontal: 'center'
					}
				}
			},
			{
				header: 'ตัวชี้วัดปัจจุบัน',
				key: 'current_indicator',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'กลยุทธ์จัดการความเสี่ยง',
				key: 'mitigation_strategy',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			}
		]

		for (let i of result[0].risk_assessment) {
			const currentIndicator = i.risk_indicator.map(obj => {
				return '- ' + obj.indicator.name
			}).join('\n')

			worksheet.addRow({
				risk_code: i.risk['code'],
				risk_type: i.risk['risk_type'],
				problem_area: i.risk['problem_area'],
				identified: i.risk['identified'],
				description: i.risk['description'],
				probability: i.probability,
				impact: i.impact,
				risk_score: i.risk_score,
				current_indicator: currentIndicator,
				mitigation_strategy: i.mitigation_strategy
			}).commit()
		}

		workbook.commit()
			.then(() => {
				fs.readFile(filePath, (err, data) => {
					return res.status(200).json({ result: data.toString('base64') })
				})
			})

	} catch (e) {
		console.log(e)
		return res.status(500).json({ e })
	}
}

const prioritization = async (req: Request, res: Response) => {
	try {
		const prioritizationRepo = getCustomRepository(PrioritizationRepository)
		const criteriaRepo = getCustomRepository(CriteriaRepository)
		const criteria = await criteriaRepo.getCriteria()
		const date = new Date()
		const filePath = `${path.resolve()}/tmp/Prioritization_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
		const options = {
			filename: filePath,
			useStyles: true,
			useSharedStrings: true
		}
		let workbook = new Excel.stream.xlsx.WorkbookWriter(options);
		let worksheet = workbook.addWorksheet('Prioritization')

		const scaleLabel = criteria.map(obj => {
			return obj.criteriaScales.map(scale => {
				return scale.value + ' ' + scale.description
			}).join('\n\n')
		})

		worksheet.columns = [
			{
				header: 'รหัส',
				key: 'ind_code',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'ชื่อตัวชี้วัด',
				key: 'ind_name',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'Indicator Type',
				key: 'ind_type',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[0].name,
				key: 'criteria_1',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[1].name,
				key: 'criteria_2',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[2].name,
				key: 'criteria_3',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[3].name,
				key: 'criteria_4',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[4].name,
				key: 'criteria_5',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[5].name,
				key: 'criteria_6',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[6].name,
				key: 'criteria_7',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[7].name,
				key: 'criteria_8',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: criteria[8].name,
				key: 'criteria_9',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'Priority Score',
				key: 'priority_score',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			}
		]

		worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
		worksheet.mergeCells('A2:A5')
		worksheet.mergeCells('B2:B5')
		worksheet.mergeCells('C2:C5')
		worksheet.mergeCells('D2:L2')
		worksheet.getCell('D2').value = 'น้ำหนัก'
		worksheet.getCell('D2').alignment = { horizontal: 'center' }
		worksheet.mergeCells('D4:L4')
		worksheet.getCell('D4').value = 'Scale'
		worksheet.getCell('D4').alignment = { horizontal: 'center' }
		worksheet.getCell('D3').value = criteria[0]['weight']
		worksheet.getCell('E3').value = criteria[1]['weight']
		worksheet.getCell('F3').value = criteria[2]['weight']
		worksheet.getCell('G3').value = criteria[3]['weight']
		worksheet.getCell('H3').value = criteria[4]['weight']
		worksheet.getCell('I3').value = criteria[5]['weight']
		worksheet.getCell('J3').value = criteria[6]['weight']
		worksheet.getCell('K3').value = criteria[7]['weight']
		worksheet.getCell('L3').value = criteria[8]['weight']
		worksheet.getRow(3).alignment = { horizontal: 'center' }
		worksheet.getCell('D5').value = scaleLabel[0]
		worksheet.getCell('E5').value = scaleLabel[1]
		worksheet.getCell('F5').value = scaleLabel[2]
		worksheet.getCell('G5').value = scaleLabel[3]
		worksheet.getCell('H5').value = scaleLabel[4]
		worksheet.getCell('I5').value = scaleLabel[5]
		worksheet.getCell('J5').value = scaleLabel[6]
		worksheet.getCell('K5').value = scaleLabel[7]
		worksheet.getCell('L5').value = scaleLabel[8]
		worksheet.getRow(5).alignment = { vertical: 'top', wrapText: true }
		worksheet.getRow(5).height = 400
		worksheet.eachRow((row, rowNumber) => {
			row.font = { size: 12 }
		})
		worksheet.getRow(1).font = { size: 13, bold: true }


		const prioritizaion = await prioritizationRepo.getPrioritization(req.query.org_id, req.query.year)
		const result = Object.assign({}, prioritizaion)
		let i = 0
		for (let obj of prioritizaion) {
			const score = await prioritizationRepo.getScore(obj.risk_assessment_indicator_id)
			worksheet.addRow({
				ind_code: obj.code,
				ind_name: obj.name,
				ind_type: obj.indicator_type,
				criteria_1: score[0].score,
				criteria_2: score[1].score,
				criteria_3: score[2].score,
				criteria_4: score[3].score,
				criteria_5: score[4].score,
				criteria_6: score[5].score,
				criteria_7: score[6].score,
				criteria_8: score[7].score,
				criteria_9: score[8].score,
				priority_score: obj.priority_score
			}).commit()
		}
		workbook.commit()
			.then(() => {
				fs.readFile(filePath, (err, data) => {
					return res.status(200).json({ result: data.toString('base64') })
				})
			})
	} catch (e) {
		console.log(e)
		return res.status(500).json({ e })
	}
}

const performanceMeasurement = (req: Request, res: Response) => {

}

export {
	riskAssessment,
	prioritization,
	performanceMeasurement
}