import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { CriteriaRepository } from "../repository/CriteriaRepository";

const create = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const repo = getCustomRepository(CriteriaRepository);
    const criteria = repo.create();
    criteria.name = data.name;
    criteria.weight = data.weight;
    criteria.is_active = data.isActive;
    const result = await repo.save(criteria);
    return res.status(201).json({ id: result.id });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const findAll = async (req: Request, res: Response) => { };
const find = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    const repo = getCustomRepository(CriteriaRepository);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export { create, findAll, find };
