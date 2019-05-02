import { Router, Request, Response } from "express";
import * as riskMaster from './controller/RiskMasterController'
import * as indicatorMaster from './controller/IndicatorMasterController'
import * as organizationUnit from './controller/OrgzanizationUnitController'
import * as riskAssessment from './controller/RiskAssessmentController'
import * as prioritization from './controller/PrioritizationController'
import * as approval from './controller/ApprovalController'
import * as authentication from './controller/AuthenticationController'
import * as user from './controller/UserController'
import * as perfmeas from './controller/PerformanceMeasurementController'
import * as exportExcel from './controller/ExportController'
import * as period from './controller/PeriodController'
const router: Router = Router();


router.get("/risks", riskMaster.findAll)
router.get("/risk", riskMaster.findCondition)
router.get("/risk/:id", riskMaster.findById)
router.post("/risk", riskMaster.create)
router.put('/risk', riskMaster.update)

router.get("/indicators", indicatorMaster.findAll)
router.get("/indicator", indicatorMaster.findCondition)
router.get("/indicator/:id", indicatorMaster.findById)
router.post("/indicator", indicatorMaster.create)
router.put('/indicator', indicatorMaster.update)

router.get("/periods", period.findAll)
router.get("/period", period.findCondition)
router.get("/period/:id", period.findById)
router.post("/period", period.create)
router.put('/period', period.update)
router.get('/on_period', period.getOnPeriod)

router.get("/users", user.findAll)
router.get("/user", user.findCondition)
router.get("/user/:id", user.findById)

router.get("/organization_unit", organizationUnit.findCondition)
router.get("/organization_unit/:id", organizationUnit.findById)

router.get("/assessment", riskAssessment.getAssessment)

router.get("/risk_assessment", riskAssessment.getRiskAssessment)
router.post("/risk_assessment", riskAssessment.create)
router.put("/risk_assessment", riskAssessment.update)

router.get('/criteria', prioritization.getCriteria)

router.get('/approval', approval.getApproval)
router.post('/approval', approval.create)

router.get('/prioritization', prioritization.getPrioritization)
router.post('/prioritization', prioritization.create)
router.get('/prioritization_score', prioritization.getScore)

router.post('/login', authentication.login)

router.get('/worklist', riskAssessment.getWorkList)

router.get('/performance_measurement', perfmeas.find)
router.post('/performance_measurement', perfmeas.create)

router.get('/performance_indicator', perfmeas.getIndicator)

router.get('/risk_assessment_export', exportExcel.riskAssessment)
router.get('/prioritization_export', exportExcel.prioritization)
router.get('/performance_measurement_export', exportExcel.performanceMeasurement)



export const routes: Router = router;
