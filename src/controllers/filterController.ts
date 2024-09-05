import { Request, Response } from 'express';
import { prisma } from '../prisma';


export const createFilter = async (req: Request, res: Response) => {
  try {
    const { name, query, dashboardId } = req.body;
    const filter = await prisma.filter.create({
      data: { name, query, dashboardId },
    });
    res.status(201).json(filter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create filter' });
  }
};

export const getFilterDetails = async (req: Request, res: Response) => {
  try {
    const { filterId } = req.params;
    const filter = await prisma.filter.findUnique({
      where: { id: Number(filterId) },
    });

    if (!filter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    res.json(filter);
  } catch (error) {
    console.error('Error fetching filter details:', error);
    res.status(500).json({ error: 'Failed to fetch filter details' });
  }
};

export const getFilters = async (_req: Request, res: Response) => {
  try {
    const filters = await prisma.filter.findMany();
    res.json(filters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
};
