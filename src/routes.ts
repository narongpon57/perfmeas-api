import { Router, Request, Response } from "express";
import * as criteria from "./controller/CriteriaController";
import * as criteria_scale from "./controller/CriteriaScaleController";
const router: Router = Router();

router.post("/criteria", criteria.create);
router.get("/criteria", criteria.findAll);
router.get("/criteria/:id", criteria.find);

router.post("/criteria_scale", criteria_scale.create);
router.get("/criteria_scale/:criteria_id", criteria_scale.find);
export const routes: Router = router;
