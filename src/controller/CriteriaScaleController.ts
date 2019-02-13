import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { CriteriaScaleRepository } from "../repository/CriteriaScaleRepository";

const create = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const repo = getCustomRepository(CriteriaScaleRepository);
    const criteriaScale = repo.create();
    criteriaScale.criteria_id = data.criteriaId;
    criteriaScale.value = data.name;
    criteriaScale.description = data.weight;
    const result = await repo.save(criteriaScale);
    return res.status(201).json({ id: result.id });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const find = async (req: Request, res: Response) => { };

export { create, find };
