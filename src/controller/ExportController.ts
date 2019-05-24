import { IndicatorMasterRepository } from './../repository/IndicatorMasterRepository';
import { OrganizationUnitRepository } from './../repository/OrganizationUnitRepository';
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { RiskAssessmentRepository } from '../repository/RiskAssessmentRepository';
import * as Excel from 'exceljs'
import * as path from 'path'
import * as fs from 'fs'
import { PrioritizationRepository } from '../repository/PrioritizationRepository';
import { CriteriaRepository } from '../repository/CritetiaRepository';
import { PerformanceMeasurementRepository } from '../repository/PerformanceMeasurementRepository';

const riskAssessment = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(RiskAssessmentRepository)
		const orgRepo = getCustomRepository(OrganizationUnitRepository)
		const orgResult = await orgRepo.findByOrgId(req.query.org_id)
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
		worksheet.mergeCells('A1:J1')
		worksheet.getCell('A1').value = 'Risk Assessment'
		worksheet.mergeCells('A2:J2')
		worksheet.getCell('A2').value = 'Department Name : ' + orgResult.name
		worksheet.mergeCells('A3:J3')
		worksheet.getCell('A3').value = 'Prepared By : ' + orgResult.creator.first_name + ' ' + orgResult.creator.last_name

		worksheet.getRow(5).values = ['รหัสความเสี่ยง', 'ประเภทความเสี่ยง', 'ปัญหาหรือกิจกรรมที่เป็นความเสี่ยง', 'รายการความเสี่ยง', 'คำอธิบาย', 'โอกาสเกิดเหตุ', 'ความรุนแรงของผลกระทบ', 'คะนนความเสี่ยง', 'ตัวชี้วัดปัจจุบัน', 'กลยุทธ์จัดการความเสี่ยง']
		
		worksheet.columns = [
			{
				// header: 'รหัสความเสี่ยง',
				key: 'risk_code',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				// header: 'ประเภทความเสี่ยง',
				key: 'risk_type',
				width: 20,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				// header: 'ปัญหาหรือกิจกรรมที่เป็นความเสี่ยง',
				key: 'problem_area',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				// header: 'รายการความเสี่ยง',
				key: 'identified',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				// header: 'คำอธิบาย',
				key: 'description',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				// header: 'โอกาสเกิดเหตุ',
				key: 'probability',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top',
						horizontal: 'center'
					}
				}
			},
			{
				// header: 'ความรุนแรงของผลกระทบ',
				key: 'impact',
				width: 25,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top',
						horizontal: 'center'
					}
				}
			},
			{
				// header: 'คะนนความเสี่ยง',
				key: 'risk_score',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top',
						horizontal: 'center'
					}
				}
			},
			{
				// header: 'ตัวชี้วัดปัจจุบัน',
				key: 'current_indicator',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				// header: 'กลยุทธ์จัดการความเสี่ยง',
				key: 'mitigation_strategy',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
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
			})
		}

		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 5) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 14, bold: true }
			} else if (rowNumber === 1) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 20, bold: true }
			} else if (rowNumber === 2 || rowNumber === 3) {
				row.font = { size: 16, bold: true }
			} else {
				row.font = { size: 12 }
			}

			if (rowNumber > 5) {
				let riskScore = row.getCell(8).value
				let colorCode = ''
				if (riskScore >= 1 && riskScore <= 3) colorCode = 'FF008000'
				else if (riskScore >= 4 && riskScore <= 6) colorCode = 'FFFFFF00'
				else if (riskScore >= 8 && riskScore <= 12) colorCode = 'FFFFA500'
				else if (riskScore >= 15 && riskScore <= 25) colorCode = 'FFFF0000'
				row.getCell(8).fill = {
					type: 'pattern',
					pattern: 'darkVertical',
					fgColor: { argb: colorCode },
					bgColor: { argb: colorCode } 
				}
			}

			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
			})

		})

		worksheet.commit()

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
		const orgRepo = getCustomRepository(OrganizationUnitRepository)
		const orgResult = await orgRepo.findByOrgId(req.query.org_id)
		const date = new Date()
		const filePath = `${path.resolve()}/tmp/Prioritization_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
		const options = {
			filename: filePath,
			useStyles: true,
			useSharedStrings: true
		}
		let workbook = new Excel.stream.xlsx.WorkbookWriter(options);
		let worksheet = workbook.addWorksheet('Prioritization')
		worksheet.mergeCells('A1:M1')
		worksheet.getCell('A1').value = 'Prioritization'
		worksheet.mergeCells('A2:M2')
		worksheet.getCell('A2').value = 'Department Name : ' + orgResult.name
		worksheet.mergeCells('A3:M3')
		worksheet.getCell('A3').value = 'Prepared By : ' + orgResult.creator.first_name + ' ' + orgResult.creator.last_name

		const scaleLabel = criteria.map(obj => {
			return obj.criteriaScales.map(scale => {
				return scale.value + ' ' + scale.description
			}).join('\n\n')
		})

		worksheet.getRow(5).values = ['รหัส', 'ชื่อตัวชี้วัด', 'ประเภทตัวชี้วัด', criteria[0].name, criteria[1].name, criteria[2].name, criteria[3].name, criteria[4].name, criteria[5].name, criteria[6].name, criteria[7].name, criteria[8].name, 'Priority Score']

		worksheet.columns = [
			{
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

		// worksheet.mergeCells('A6:A9')
		// worksheet.mergeCells('B6:B9')
		// worksheet.mergeCells('C6:C9')
		// worksheet.mergeCells('M6:M9')
		// worksheet.mergeCells('D6:L6')
		// worksheet.getCell('D6').value = 'น้ำหนัก'
		// worksheet.getCell('D6').alignment = { horizontal: 'center' }
		// worksheet.getCell('M6').value = ''
		// worksheet.getCell('M7').value = ''
		// worksheet.mergeCells('D8:L8')
		// worksheet.getCell('D8').value = 'Scale'
		// worksheet.getCell('D8').alignment = { horizontal: 'center' }
		// worksheet.getCell('D7').value = criteria[0]['weight']
		// worksheet.getCell('E7').value = criteria[1]['weight']
		// worksheet.getCell('F7').value = criteria[2]['weight']
		// worksheet.getCell('G7').value = criteria[3]['weight']
		// worksheet.getCell('H7').value = criteria[4]['weight']
		// worksheet.getCell('I7').value = criteria[5]['weight']
		// worksheet.getCell('J7').value = criteria[6]['weight']
		// worksheet.getCell('K7').value = criteria[7]['weight']
		// worksheet.getCell('L7').value = criteria[8]['weight']
		// worksheet.getCell('M8').value = ''
		// worksheet.getRow(7).alignment = { horizontal: 'center' }
		// worksheet.getCell('D9').value = scaleLabel[0]
		// worksheet.getCell('E9').value = scaleLabel[1]
		// worksheet.getCell('F9').value = scaleLabel[2]
		// worksheet.getCell('G9').value = scaleLabel[3]
		// worksheet.getCell('H9').value = scaleLabel[4]
		// worksheet.getCell('I9').value = scaleLabel[5]
		// worksheet.getCell('J9').value = scaleLabel[6]
		// worksheet.getCell('K9').value = scaleLabel[7]
		// worksheet.getCell('L9').value = scaleLabel[8]
		// worksheet.getCell('M9').value = ''
		// worksheet.getRow(9).alignment = { vertical: 'top', wrapText: true }
		// worksheet.getRow(9).height = 400

		const prioritization = await prioritizationRepo.getPrioritization(req.query.org_id, req.query.year)
		const result = Object.assign({}, prioritization)
		let i = 0
		for (let obj of prioritization) {
			if (obj.priority_score !== null) {
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
				})
			}
		}

		const topScore = prioritization.reduce((max, obj) => {
			return obj.priority_score > max ? obj.priority_score : max
		}, 0)

		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 5) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 14, bold: true }
			} else if (rowNumber === 1) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 20, bold: true }
			} else if (rowNumber === 2 || rowNumber === 3) {
				row.font = { size: 16, bold: true }
			} else {
				row.font = { size: 12 }
			}

			if (rowNumber > 5) {
				let score = row.getCell(13).value
				if (score === topScore) {
					row.getCell(13).fill = {
						type: 'pattern',
						pattern: 'darkVertical',
						fgColor: { argb: 'FFFF0000' },
						bgColor: { argb: 'FFFF0000' }
					}
				}
			}

			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
			})
		})

		worksheet.commit()
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

const performanceMeasurement = async (req: Request, res: Response) => {
	try {
		const repo = getCustomRepository(PerformanceMeasurementRepository)
		const result = await repo.getPerfMeas(req.query.org_id, req.query.year)
		const orgRepo = getCustomRepository(OrganizationUnitRepository)
		const orgResult = await orgRepo.findByOrgId(req.query.org_id)
		const date = new Date()
		const filePath = `${path.resolve()}/tmp/PerformanceMeasurement_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
		const options = {
			filename: filePath,
			useStyles: true,
			useSharedStrings: true
		}
		let workbook = new Excel.stream.xlsx.WorkbookWriter(options);
		let worksheet = workbook.addWorksheet('PerformanceMeasurement')
		worksheet.mergeCells('A1:S1')
		worksheet.getCell('A1').value = 'Performance Measurement'
		worksheet.mergeCells('A2:S2')
		worksheet.getCell('A2').value = 'Department Name : ' + orgResult.name
		worksheet.mergeCells('A3:S3')
		worksheet.getCell('A3').value = 'Prepared By : ' + orgResult.creator.first_name + ' ' + orgResult.creator.last_name
		worksheet.getRow(5).values = ['รหัส', 'ชื่อตัวชี้วัด', 'ตัวตั้ง (a) / ตัวหาร (b)', 'สูตรการคำนวณ', 'เครื่องหมาย', 'เป้าหมาย', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.', 'YTD']

		worksheet.columns = [
			{
				// header: 'รหัส',
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
				// header: 'ชื่อตัวชี้วัด',
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
				// header: 'ตัวตั้ง (a) / ตัวหาร (b)',
				key: 'ind_mul_div',
				width: 50,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				// header: 'สูตรการคำนวณ',
				key: 'formular',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				// header: 'เครื่องหมาย',
				key: 'operator',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				// header: 'เป้าหมาย',
				key: 'target',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				// header: 'ม.ค.',
				key: 'jan',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'ก.พ.',
				key: 'feb',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'มี.ค.',
				key: 'mar',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'เม.ย.',
				key: 'apr',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'พ.ค.',
				key: 'may',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'มิ.ย.',
				key: 'jun',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'ก.ค.',
				key: 'jul',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'ส.ค.',
				key: 'aug',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'ก.ย.',
				key: 'sep',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'ต.ค.',
				key: 'oct',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'พ.ย.',
				key: 'nov',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'ธ.ค.',
				key: 'dec',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				// header: 'YTD',
				key: 'ytd',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
		]

		for (let perf of result) {
			// console.log(perf)
			worksheet.addRow({
				ind_code: perf.code,
				ind_name: perf.name,
				ind_mul_div: perf.multiplier,
				formular: perf.formular,
				operator: perf.operator,
				target: perf.target,
				// jan: perf.jan_multiplier_value,
				// feb: Number(perf.feb_multiplier_value),
				// mar: Number(perf.mar_multiplier_value),
				// apr: Number(perf.apr_multiplier_value),
				// may: Number(perf.may_multiplier_value),
				// jun: Number(perf.jun_multiplier_value),
				// jul: Number(perf.jul_multiplier_value),
				// aug: Number(perf.aug_multiplier_value),
				// sep: Number(perf.sep_multiplier_value),
				// oct: Number(perf.oct_multiplier_value),
				// nov: Number(perf.nov_multiplier_value),
				// dec: Number(perf.dec_multiplier_value),
				jan: perf.jan_multiplier_value === null ? perf.jan_multiplier_value : Number(perf.jan_multiplier_value),
				feb: perf.feb_multiplier_value === null ? perf.feb_multiplier_value : Number(perf.feb_multiplier_value),
				mar: perf.mar_multiplier_value === null ? perf.mar_multiplier_value : Number(perf.mar_multiplier_value),
				apr: perf.apr_multiplier_value === null ? perf.apr_multiplier_value : Number(perf.apr_multiplier_value),
				may: perf.may_multiplier_value === null ? perf.may_multiplier_value : Number(perf.may_multiplier_value),
				jun: perf.jun_multiplier_value === null ? perf.jun_multiplier_value : Number(perf.jun_multiplier_value),
				jul: perf.jul_multiplier_value === null ? perf.jul_multiplier_value : Number(perf.jul_multiplier_value),
				aug: perf.aug_multiplier_value === null ? perf.aug_multiplier_value : Number(perf.aug_multiplier_value),
				sep: perf.sep_multiplier_value === null ? perf.sep_multiplier_value : Number(perf.sep_multiplier_value),
				oct: perf.oct_multiplier_value === null ? perf.oct_multiplier_value : Number(perf.oct_multiplier_value),
				nov: perf.nov_multiplier_value === null ? perf.nov_multiplier_value : Number(perf.nov_multiplier_value),
				dec: perf.dec_multiplier_value === null ? perf.dec_multiplier_value : Number(perf.dec_multiplier_value),
				ytd: sumYtdMultiplier(perf)
			})

			worksheet.addRow({
				ind_mul_div: perf.divisor,
				// jan: Number(perf.jan_divisor_value),
				// feb: Number(perf.feb_divisor_value),
				// mar: Number(perf.mar_divisor_value),
				// apr: Number(perf.apr_divisor_value),
				// may: Number(perf.may_divisor_value),
				// jun: Number(perf.jun_divisor_value),
				// jul: Number(perf.jul_divisor_value),
				// aug: Number(perf.aug_divisor_value),
				// sep: Number(perf.sep_divisor_value),
				// oct: Number(perf.oct_divisor_value),
				// nov: Number(perf.nov_divisor_value),
				// dec: Number(perf.dec_divisor_value),
				jan: perf.jan_divisor_value === null ? perf.jan_divisor_value : Number(perf.jan_divisor_value),
				feb: perf.feb_divisor_value === null ? perf.feb_divisor_value : Number(perf.feb_divisor_value),
				mar: perf.mar_divisor_value === null ? perf.mar_divisor_value : Number(perf.mar_divisor_value),
				apr: perf.apr_divisor_value === null ? perf.apr_divisor_value : Number(perf.apr_divisor_value),
				may: perf.may_divisor_value === null ? perf.may_divisor_value : Number(perf.may_divisor_value),
				jun: perf.jun_divisor_value === null ? perf.jun_divisor_value : Number(perf.jun_divisor_value),
				jul: perf.jul_divisor_value === null ? perf.jul_divisor_value : Number(perf.jul_divisor_value),
				aug: perf.aug_divisor_value === null ? perf.aug_divisor_value : Number(perf.aug_divisor_value),
				sep: perf.sep_divisor_value === null ? perf.sep_divisor_value : Number(perf.sep_divisor_value),
				oct: perf.oct_divisor_value === null ? perf.oct_divisor_value : Number(perf.oct_divisor_value),
				nov: perf.nov_divisor_value === null ? perf.nov_divisor_value : Number(perf.nov_divisor_value),
				dec: perf.dec_divisor_value === null ? perf.dec_divisor_value : Number(perf.dec_divisor_value),
				ytd: sumYdtDivisor(perf)
			})
			// worksheet.addRow({
			// })


			// const currentRowNumber = worksheet.lastRow.number
			// const perfRows = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S']

			// // Multiplier YTD
			// worksheet.getCell(`S${currentRowNumber - 1}`).value = {
			// 	formula: `=SUM(G${currentRowNumber - 1}:R${currentRowNumber - 1})`,
			// 	result: 0
			// }

			// //Divisor YTD
			// worksheet.getCell(`S${currentRowNumber}`).value = {
			// 	formula: `=SUM(G${currentRowNumber}:R${currentRowNumber})`,
			// 	result: 0
			// }



			// for (let row of perfRows) {
			// 	const formular = `IFERROR((${row}${currentRowNumber - 1}/${row}${currentRowNumber}) * ${perf.unit}, 0)`
			// 	worksheet.getCell(`${row}${currentRowNumber + 1}`).value = {
			// 		formula: formular,
			// 		result: 0
			// 	}
			// }

			worksheet.addRow({
				jan: calYTDperMonth(perf.jan_multiplier_value, perf.jan_divisor_value, perf.unit),
				feb: calYTDperMonth(perf.feb_multiplier_value, perf.feb_divisor_value, perf.unit),
				mar: calYTDperMonth(perf.mar_multiplier_value, perf.mar_divisor_value, perf.unit),
				apr: calYTDperMonth(perf.apr_multiplier_value, perf.apr_divisor_value, perf.unit),
				may: calYTDperMonth(perf.may_multiplier_value, perf.may_divisor_value, perf.unit),
				jun: calYTDperMonth(perf.jun_multiplier_value, perf.jun_divisor_value, perf.unit),
				jul: calYTDperMonth(perf.jul_multiplier_value, perf.jul_divisor_value, perf.unit),
				aug: calYTDperMonth(perf.aug_multiplier_value, perf.aug_divisor_value, perf.unit),
				sep: calYTDperMonth(perf.sep_multiplier_value, perf.sep_divisor_value, perf.unit),
				oct: calYTDperMonth(perf.oct_multiplier_value, perf.oct_divisor_value, perf.unit),
				nov: calYTDperMonth(perf.nov_multiplier_value, perf.nov_divisor_value, perf.unit),
				dec: calYTDperMonth(perf.dec_multiplier_value, perf.dec_divisor_value, perf.unit),
				ytd: sumYtdSummary(perf, perf.unit)
			})

			worksheet.mergeCells(`A${worksheet.lastRow.number - 2}:A${worksheet.lastRow.number - 1}`)
			worksheet.mergeCells(`B${worksheet.lastRow.number - 2}:B${worksheet.lastRow.number - 1}`)
			worksheet.mergeCells(`D${worksheet.lastRow.number - 2}:D${worksheet.lastRow.number - 1}`)
			worksheet.mergeCells(`E${worksheet.lastRow.number - 2}:E${worksheet.lastRow.number - 1}`)
			worksheet.mergeCells(`F${worksheet.lastRow.number - 2}:F${worksheet.lastRow.number - 1}`)
			worksheet.mergeCells(`A${worksheet.lastRow.number}:F${worksheet.lastRow.number}`)
			let row = worksheet.getRow(worksheet.lastRow.number)
			row.eachCell({ includeEmpty: true }, (cell, number) => {
				if (cell.value === '' || cell.value === null) {
					cell.fill = {
						type: 'pattern',
						pattern: 'darkVertical',
						fgColor: { argb: 'FFFAEBD7' },
						bgColor: { argb: 'FFFAEBD7' }
					}
				} else {
					let value = cell.value
					let onTarget = checkTarget(value, perf.operator, perf.target)
					if (onTarget) {
						cell.fill = {
							type: 'pattern',
							pattern: 'darkVertical',
							fgColor: { argb: 'FF008000' },
							bgColor: { argb: 'FF008000' }
						}
					} else {
						cell.fill = {
							type: 'pattern',
							pattern: 'darkVertical',
							fgColor: { argb: 'FFFF0000' },
							bgColor: { argb: 'FFFF0000' }
						}
					}
				}
			})
		}

		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 5) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 14, bold: true }
			} else if (rowNumber === 1) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 20, bold: true }
			} else if (rowNumber === 2 || rowNumber === 3) {
				row.font = { size: 16, bold: true }
			} else {
				row.font = { size: 12 }
			}

			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
			})
		})
		worksheet.commit()
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

const prioritizationWithHeader = async (req: Request, res: Response) => {
	try {
		const prioritizationRepo = getCustomRepository(PrioritizationRepository)
		const criteriaRepo = getCustomRepository(CriteriaRepository)
		const criteria = await criteriaRepo.getCriteria()
		const orgRepo = getCustomRepository(OrganizationUnitRepository)
		const orgResult = await orgRepo.findByOrgId(req.query.org_id)
		const date = new Date()
		const filePath = `${path.resolve()}/tmp/Prioritization_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
		const options = {
			filename: filePath,
			useStyles: true,
			useSharedStrings: true
		}
		let workbook = new Excel.stream.xlsx.WorkbookWriter(options);
		let worksheet = workbook.addWorksheet('Prioritization')
		worksheet.mergeCells('A1:M1')
		worksheet.getCell('A1').value = 'Prioritization'
		worksheet.mergeCells('A2:M2')
		worksheet.getCell('A2').value = 'Department Name : ' + orgResult.name
		worksheet.mergeCells('A3:M3')
		worksheet.getCell('A3').value = 'Prepared By : ' + orgResult.creator.first_name + ' ' + orgResult.creator.last_name

		const scaleLabel = criteria.map(obj => {
			return obj.criteriaScales.map(scale => {
				return scale.value + ' ' + scale.description
			}).join('\n\n')
		})

		worksheet.getRow(5).values = ['รหัส', 'ชื่อตัวชี้วัด', 'ประเภทตัวชี้วัด', criteria[0].name, criteria[1].name, criteria[2].name, criteria[3].name, criteria[4].name, criteria[5].name, criteria[6].name, criteria[7].name, criteria[8].name, 'Priority Score']

		worksheet.columns = [
			{
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

		worksheet.mergeCells('A6:A9')
		worksheet.mergeCells('B6:B9')
		worksheet.mergeCells('C6:C9')
		worksheet.mergeCells('M6:M9')
		worksheet.mergeCells('D6:L6')
		worksheet.getCell('D6').value = 'น้ำหนัก'
		worksheet.getCell('D6').alignment = { horizontal: 'center' }
		worksheet.getCell('M6').value = ''
		worksheet.getCell('M7').value = ''
		worksheet.mergeCells('D8:L8')
		worksheet.getCell('D8').value = 'Scale'
		worksheet.getCell('D8').alignment = { horizontal: 'center' }
		worksheet.getCell('D7').value = criteria[0]['weight']
		worksheet.getCell('E7').value = criteria[1]['weight']
		worksheet.getCell('F7').value = criteria[2]['weight']
		worksheet.getCell('G7').value = criteria[3]['weight']
		worksheet.getCell('H7').value = criteria[4]['weight']
		worksheet.getCell('I7').value = criteria[5]['weight']
		worksheet.getCell('J7').value = criteria[6]['weight']
		worksheet.getCell('K7').value = criteria[7]['weight']
		worksheet.getCell('L7').value = criteria[8]['weight']
		worksheet.getCell('M8').value = ''
		worksheet.getRow(7).alignment = { horizontal: 'center' }
		worksheet.getCell('D9').value = scaleLabel[0]
		worksheet.getCell('E9').value = scaleLabel[1]
		worksheet.getCell('F9').value = scaleLabel[2]
		worksheet.getCell('G9').value = scaleLabel[3]
		worksheet.getCell('H9').value = scaleLabel[4]
		worksheet.getCell('I9').value = scaleLabel[5]
		worksheet.getCell('J9').value = scaleLabel[6]
		worksheet.getCell('K9').value = scaleLabel[7]
		worksheet.getCell('L9').value = scaleLabel[8]
		worksheet.getCell('M9').value = ''
		worksheet.getRow(9).alignment = { vertical: 'top', wrapText: true }
		worksheet.getRow(9).height = 400

		const prioritization = await prioritizationRepo.getPrioritization(req.query.org_id, req.query.year)
		const result = Object.assign({}, prioritization)
		let i = 0
		for (let obj of prioritization) {
			if (obj.priority_score !== null) {
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
				})
			}
		}

		const topScore = prioritization.reduce((max, obj) => {
			return obj.priority_score > max ? obj.priority_score : max
		}, 0)

		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 5) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 14, bold: true }
			} else if (rowNumber === 1) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 20, bold: true }
			} else if (rowNumber === 2 || rowNumber === 3) {
				row.font = { size: 16, bold: true }
			} else {
				row.font = { size: 12 }
			}

			if (rowNumber > 9) {
				let score = row.getCell(13).value
				if (score === topScore) {
					row.getCell(13).fill = {
						type: 'pattern',
						pattern: 'darkVertical',
						fgColor: { argb: 'FFFF0000' },
						bgColor: { argb: 'FFFF0000' }
					}
				}
			}

			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
			})
		})

		worksheet.commit()
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

const indicator = async (req: Request, res: Response) => {
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

		let worksheet = workbook.addWorksheet('Indicator')
		const indicatorRepo = getCustomRepository(IndicatorMasterRepository)
		


		const indicator = await indicatorRepo.findByIds(req.query.indicator_id)
		worksheet.getCell('A1').value = 'รหัส'
		worksheet.getCell('A2').value = 'ชื่อ'
		worksheet.getCell('A3').value = 'คำอธิบาย'
		worksheet.getCell('A4').value = 'เหตุผลในการเลือก'
		worksheet.getCell('A5').value = 'ประเภท'
		worksheet.getCell('A6').value = 'ตัวตั้ง'
		worksheet.getCell('A7').value = 'ตัวหาร'
		worksheet.getCell('A8').value = 'หน่วย'
		worksheet.getCell('A9').value = 'สูตร'
		worksheet.getCell('A10').value = 'เครื่องหมาย'
		worksheet.getCell('A11').value = 'เป้าหมาย'
		worksheet.getCell('A12').value = 'ความถี่ในการประเมิน'
		worksheet.getCell('A13').value = 'มารตฐาน'
		worksheet.getCell('A14').value = 'ขอบเขต'
		worksheet.getCell('A15').value = 'วันที่เริ่มใช้งาน'
		worksheet.getCell('A16').value = 'วันที่สิ้นสุด'
		worksheet.getCell('A17').value = 'หมายเหตุ'

		worksheet.getCell('B1').value = indicator[0].code
		worksheet.getCell('B2').value = indicator[0].name
		worksheet.getCell('B3').value = indicator[0].description
		worksheet.getCell('B4').value = indicator[0].reason
		worksheet.getCell('B5').value = indicator[0].indicator_type
		worksheet.getCell('B6').value = indicator[0].multiplier
		worksheet.getCell('B7').value = indicator[0].divisor
		worksheet.getCell('B8').value = indicator[0].unit
		worksheet.getCell('B9').value = indicator[0].formular
		worksheet.getCell('B10').value = indicator[0].operator
		worksheet.getCell('B11').value = indicator[0].target
		worksheet.getCell('B12').value = indicator[0].frequency
		worksheet.getCell('B13').value = indicator[0].standard
		worksheet.getCell('B14').value = indicator[0].measurement_domain
		worksheet.getCell('B15').value = indicator[0].start_date
		worksheet.getCell('B16').value = indicator[0].end_date
		worksheet.getCell('B17').value = indicator[0].remark

		worksheet.columns = [
			{
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			},
			{
				width: 100,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'top'
					}
				}
			}
		]
		worksheet.eachRow((row, rowNumber) => {
			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
				if (cellNumber === 1) {
					cell.font = { size: 16, bold: true }
				} else {
					cell.font = { size: 16 }
					cell.alignment = { wrapText: true }
				}
			})
		})

		worksheet.commit()

		// ---------------------Indicator------------------------//
		// ---------------------End Indicator------------------------//


		// ------------------Prioritization------------------ //
		
		let worksheet2 = workbook.addWorksheet('Prioritization')

		const scaleLabel = criteria.map(obj => {
			return obj.criteriaScales.map(scale => {
				return scale.value + ' ' + scale.description
			}).join('\n\n')
		})

		worksheet2.columns = [
			{
				header: 'OU Code',
				key: 'org_code',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'OU Name',
				key: 'org_name',
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

		const prioritization = await prioritizationRepo.getPrioritizationByIndicator(req.query.indicator_id, req.query.year)
		for (let obj of prioritization) {
			const score = await prioritizationRepo.getScore(obj.risk_assessment_indicator_id)
			if (score.length) {
				worksheet2.addRow({
					org_code: obj.organization_code,
					org_name: obj.organization_name,
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
				})
			}
		}

		const topScore = prioritization.reduce((max, obj) => {
			return obj.priority_score > max ? obj.priority_score : max
		}, 0)

		worksheet2.eachRow((row, rowNumber) => {
			if (rowNumber === 1) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 14, bold: true }
			} else {
				row.font = { size: 12 }
			}

			if (rowNumber > 5) {
				let score = row.getCell(13).value
				if (score === topScore) {
					row.getCell(13).fill = {
						type: 'pattern',
						pattern: 'darkVertical',
						fgColor: { argb: 'FFFF0000' },
						bgColor: { argb: 'FFFF0000' }
					}
				}
			}

			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
			})
		})

		worksheet2.commit()
		// ------------------End Prioritization------------------ //


		// ------------------Performance Measurement------------------ //

		const perfMeasRepo = getCustomRepository(PerformanceMeasurementRepository)
		const perfs = await perfMeasRepo.getPerfByIndicator(req.query.indicator_id, req.query.year)
		let worksheet3 = workbook.addWorksheet('PerformanceMeasurement')

		worksheet3.columns = [
			{
				header: 'OU Code',
				key: 'org_code',
				width: 15,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			{
				header: 'OU Name',
				key: 'org_name',
				width: 30,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					}
				}
			},
			// {
			// 	header: 'ตัวตั้ง (a) / ตัวหาร (b)',
			// 	key: 'ind_mul_div',
			// 	width: 50,
			// 	style: {
			// 		alignment: {
			// 			wrapText: true,
			// 			vertical: 'middle'
			// 		}
			// 	}
			// },
			// {
			// 	header: 'สูตรการคำนวณ',
			// 	key: 'formular',
			// 	width: 15,
			// 	style: {
			// 		alignment: {
			// 			wrapText: true,
			// 			vertical: 'middle'
			// 		}
			// 	}
			// },
			// {
			// 	header: 'เครื่องหมาย',
			// 	key: 'operator',
			// 	width: 15,
			// 	style: {
			// 		alignment: {
			// 			wrapText: true,
			// 			vertical: 'middle'
			// 		}
			// 	}
			// },
			// {
			// 	header: 'เป้าหมาย',
			// 	key: 'target',
			// 	width: 15,
			// 	style: {
			// 		alignment: {
			// 			wrapText: true,
			// 			vertical: 'middle'
			// 		}
			// 	}
			// },
			{
				header: 'ม.ค.',
				key: 'jan',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'ก.พ.',
				key: 'feb',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'มี.ค.',
				key: 'mar',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'เม.ย.',
				key: 'apr',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'พ.ค.',
				key: 'may',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'มิ.ย.',
				key: 'jun',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'ก.ค.',
				key: 'jul',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'ส.ค.',
				key: 'aug',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'ก.ย.',
				key: 'sep',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'ต.ค.',
				key: 'oct',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'พ.ย.',
				key: 'nov',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'ธ.ค.',
				key: 'dec',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
			{
				header: 'YTD',
				key: 'ytd',
				width: 10,
				style: {
					alignment: {
						wrapText: true,
						vertical: 'middle'
					},
					numFmt: '0.00'
				}
			},
		]

		for (let perf of perfs) {
			worksheet3.addRow({
				org_code: perf.organization_code,
				org_name: perf.orgamization_name,
				jan: perf.jan_multiplier_value === null ? perf.jan_multiplier_value : Number(perf.jan_multiplier_value),
				feb: perf.feb_multiplier_value === null ? perf.feb_multiplier_value : Number(perf.feb_multiplier_value),
				mar: perf.mar_multiplier_value === null ? perf.mar_multiplier_value : Number(perf.mar_multiplier_value),
				apr: perf.apr_multiplier_value === null ? perf.apr_multiplier_value : Number(perf.apr_multiplier_value),
				may: perf.may_multiplier_value === null ? perf.may_multiplier_value : Number(perf.may_multiplier_value),
				jun: perf.jun_multiplier_value === null ? perf.jun_multiplier_value : Number(perf.jun_multiplier_value),
				jul: perf.jul_multiplier_value === null ? perf.jul_multiplier_value : Number(perf.jul_multiplier_value),
				aug: perf.aug_multiplier_value === null ? perf.aug_multiplier_value : Number(perf.aug_multiplier_value),
				sep: perf.sep_multiplier_value === null ? perf.sep_multiplier_value : Number(perf.sep_multiplier_value),
				oct: perf.oct_multiplier_value === null ? perf.oct_multiplier_value : Number(perf.oct_multiplier_value),
				nov: perf.nov_multiplier_value === null ? perf.nov_multiplier_value : Number(perf.nov_multiplier_value),
				dec: perf.dec_multiplier_value === null ? perf.dec_multiplier_value : Number(perf.dec_multiplier_value),
				ytd: sumYtdMultiplier(perf)
			})

			worksheet3.addRow({
				ind_mul_div: perf.divisor,
				jan: perf.jan_divisor_value === null ? perf.jan_divisor_value : Number(perf.jan_divisor_value),
				feb: perf.feb_divisor_value === null ? perf.feb_divisor_value : Number(perf.feb_divisor_value),
				mar: perf.mar_divisor_value === null ? perf.mar_divisor_value : Number(perf.mar_divisor_value),
				apr: perf.apr_divisor_value === null ? perf.apr_divisor_value : Number(perf.apr_divisor_value),
				may: perf.may_divisor_value === null ? perf.may_divisor_value : Number(perf.may_divisor_value),
				jun: perf.jun_divisor_value === null ? perf.jun_divisor_value : Number(perf.jun_divisor_value),
				jul: perf.jul_divisor_value === null ? perf.jul_divisor_value : Number(perf.jul_divisor_value),
				aug: perf.aug_divisor_value === null ? perf.aug_divisor_value : Number(perf.aug_divisor_value),
				sep: perf.sep_divisor_value === null ? perf.sep_divisor_value : Number(perf.sep_divisor_value),
				oct: perf.oct_divisor_value === null ? perf.oct_divisor_value : Number(perf.oct_divisor_value),
				nov: perf.nov_divisor_value === null ? perf.nov_divisor_value : Number(perf.nov_divisor_value),
				dec: perf.dec_divisor_value === null ? perf.dec_divisor_value : Number(perf.dec_divisor_value),
				ytd: sumYdtDivisor(perf)
			})

			worksheet3.addRow({
				jan: calYTDperMonth(perf.jan_multiplier_value, perf.jan_divisor_value, perf.unit),
				feb: calYTDperMonth(perf.feb_multiplier_value, perf.feb_divisor_value, perf.unit),
				mar: calYTDperMonth(perf.mar_multiplier_value, perf.mar_divisor_value, perf.unit),
				apr: calYTDperMonth(perf.apr_multiplier_value, perf.apr_divisor_value, perf.unit),
				may: calYTDperMonth(perf.may_multiplier_value, perf.may_divisor_value, perf.unit),
				jun: calYTDperMonth(perf.jun_multiplier_value, perf.jun_divisor_value, perf.unit),
				jul: calYTDperMonth(perf.jul_multiplier_value, perf.jul_divisor_value, perf.unit),
				aug: calYTDperMonth(perf.aug_multiplier_value, perf.aug_divisor_value, perf.unit),
				sep: calYTDperMonth(perf.sep_multiplier_value, perf.sep_divisor_value, perf.unit),
				oct: calYTDperMonth(perf.oct_multiplier_value, perf.oct_divisor_value, perf.unit),
				nov: calYTDperMonth(perf.nov_multiplier_value, perf.nov_divisor_value, perf.unit),
				dec: calYTDperMonth(perf.dec_multiplier_value, perf.dec_divisor_value, perf.unit),
				ytd: sumYtdSummary(perf, perf.unit)
			})

			worksheet3.mergeCells(`A${worksheet3.lastRow.number - 2}:A${worksheet3.lastRow.number - 1}`)
			worksheet3.mergeCells(`B${worksheet3.lastRow.number - 2}:B${worksheet3.lastRow.number - 1}`)
			// worksheet3.mergeCells(`D${worksheet3.lastRow.number - 2}:D${worksheet3.lastRow.number - 1}`)
			// worksheet3.mergeCells(`E${worksheet3.lastRow.number - 2}:E${worksheet3.lastRow.number - 1}`)
			// worksheet3.mergeCells(`F${worksheet3.lastRow.number - 2}:F${worksheet3.lastRow.number - 1}`)
			worksheet3.mergeCells(`A${worksheet3.lastRow.number}:B${worksheet3.lastRow.number}`)
			let row = worksheet3.getRow(worksheet3.lastRow.number)
			row.eachCell({ includeEmpty: true }, (cell, number) => {
				if (cell.value === '' || cell.value === null) {
					cell.fill = {
						type: 'pattern',
						pattern: 'darkVertical',
						fgColor: { argb: 'FFFAEBD7' },
						bgColor: { argb: 'FFFAEBD7' }
					}
				} else {
					let value = cell.value
					let onTarget = checkTarget(value, perf.operator, perf.target)
					if (onTarget) {
						cell.fill = {
							type: 'pattern',
							pattern: 'darkVertical',
							fgColor: { argb: 'FF008000' },
							bgColor: { argb: 'FF008000' }
						}
					} else {
						cell.fill = {
							type: 'pattern',
							pattern: 'darkVertical',
							fgColor: { argb: 'FFFF0000' },
							bgColor: { argb: 'FFFF0000' }
						}
					}
				}
			})
		}

		worksheet3.eachRow((row, rowNumber) => {
			if (rowNumber === 1) {
				row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
				row.font = { size: 14, bold: true }
			} else {
				row.font = { size: 12 }
			}

			row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				}
			})
		})
		worksheet3.commit()

			// ------------------End Performance Measurement------------------ //
		
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


const sumYtdMultiplier = (perf) => {
	return Number((Number(perf.jan_multiplier_value) + Number(perf.feb_multiplier_value) + Number(perf.mar_multiplier_value) + Number(perf.apr_multiplier_value) + Number(perf.may_multiplier_value) + Number(perf.jun_multiplier_value) + Number(perf.jul_multiplier_value) + Number(perf.aug_multiplier_value) + Number(perf.sep_multiplier_value) + Number(perf.oct_multiplier_value) + Number(perf.nov_multiplier_value) + Number(perf.dec_multiplier_value)).toFixed(2))
}

const sumYdtDivisor = (perf) => {
	return Number((Number(perf.jan_divisor_value) + Number(perf.feb_divisor_value) + Number(perf.mar_divisor_value) + Number(perf.apr_divisor_value) + Number(perf.may_divisor_value) + Number(perf.jun_divisor_value) + Number(perf.jul_divisor_value) + Number(perf.aug_divisor_value) + Number(perf.sep_divisor_value) + Number(perf.oct_divisor_value) + Number(perf.nov_divisor_value) + Number(perf.dec_divisor_value)).toFixed(2))
}

const sumYtdSummary = (perf, unit) => {
	return isNaN((sumYtdMultiplier(perf) / sumYdtDivisor(perf)) * unit) ? '' : Number(((sumYtdMultiplier(perf) / sumYdtDivisor(perf)) * unit).toFixed(2))
}

const checkTarget = (value, operator, target1) => {
	let onTarget
	// console.log(value, operator, target, parseFloat(target), target === parseFloat(target).toFixed(2))
	if (!isNaN(value)) {
		let target = parseFloat(target1)
		switch (operator) {
			case '=':
				onTarget = value === target
				break
			case '>':
				onTarget = value > target
				break
			case '<':
				onTarget = value < target
				break
			case '>=':
				onTarget = value >= target
				break
			case '<=':
				onTarget = value >= target
				break
			case '!=':
				onTarget = value !== target
				break
			default:
				onTarget = ''
		}
	}
	return onTarget
}

const checkTargetSummary = (perf, unit, operator, target1) => {
	let activeClass = ''
	let target = parseInt(target1)
	let ytdMonth = (this.ytdMultiplier(perf) / this.ydtDivisor(perf)) * unit
	if (!isNaN(ytdMonth)) {
		let onTarget
		switch (operator) {
			case '=':
				onTarget = ytdMonth === target
				break
			case '>':
				onTarget = ytdMonth > target
				break
			case '<':
				onTarget = ytdMonth < target
				break
			case '>=':
				onTarget = ytdMonth >= target
				break
			case '<=':
				onTarget = ytdMonth >= target
				break
			case '!=':
				onTarget = ytdMonth !== target
				break
			default:
				onTarget = ''
		}
		activeClass = onTarget ? 'target' : 'no-target'
	}
	return activeClass
}

const calYTDperMonth = (multiplier, divisor, unit) => {
	return isNaN((multiplier / divisor) * unit) ? '' : Number(((multiplier / divisor) * unit).toFixed(2))
}

export {
	riskAssessment,
	prioritization,
	performanceMeasurement,
	indicator
}