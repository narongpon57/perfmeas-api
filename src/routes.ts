import { Router, Request, Response } from "express";
import * as criteria from "./controller/CriteriaController";
const router: Router = Router();

router.post("/criteria", criteria.create);
router.get("/criteria", criteria.findAll);
router.get("/criteria/:id", criteria.find);
export const routes: Router = router;
