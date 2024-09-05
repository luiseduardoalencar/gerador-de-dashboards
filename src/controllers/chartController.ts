import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { Parser } from 'expr-eval'; 


export const createChart = async (req: Request, res: Response) => {
  try {
    const { name, xAxis, yAxis, type, isPublic, dashboardId, data } = req.body;
    const chart = await prisma.chart.create({
      data: { name, xAxis, yAxis, type, isPublic, dashboardId, data },
    });
    res.status(201).json(chart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chart' });
  }
};


export const getChartDetails = async (req: Request, res: Response) => {
  try {
    const { chartId } = req.params;
    const chart = await prisma.chart.findUnique({
      where: { id: Number(chartId) },
    });

    if (!chart) {
      return res.status(404).json({ error: 'Chart not found' });
    }

    res.json(chart);
  } catch (error) {
    console.error('Error fetching chart details:', error);
    res.status(500).json({ error: 'Failed to fetch chart details' });
  }
};


export const getCharts = async (_req: Request, res: Response) => {
  try {
    const charts = await prisma.chart.findMany();
    res.json(charts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch charts' });
  }
};

export const getChartsWithFilters = async (req: Request, res: Response) => {
  try {
    const { dashboardId, filterId } = req.query;


    const filter = await prisma.filter.findFirst({
      where: { id: Number(filterId), dashboardId: Number(dashboardId) },
    });

    if (!filter) {
      return res.status(404).json({ error: 'Filter not found or not associated with the specified dashboard' });
    }


    const charts = await prisma.chart.findMany({
      where: { dashboardId: Number(dashboardId) },
    });

    const parser = new Parser();

   
    const filteredCharts = charts.map((chart) => {
      try {
        const parsedExpression = parser.parse(filter.query);
        if (chart.data && Array.isArray(chart.data)) {
          chart.data = chart.data.filter((item: any) => parsedExpression.evaluate(item));
        }
      } catch (err) {
        console.error(`Failed to apply filter on chart ${chart.id}`, err);
      }
      return chart;
    });
    

    res.json(filteredCharts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch charts with filters' });
  }
};
