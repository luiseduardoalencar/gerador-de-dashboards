import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { Parser } from 'expr-eval';

export const createDashboard = async (req: Request, res: Response) => {
  try {
    const { name, isPublic } = req.body;
    const dashboard = await prisma.dashboard.create({
      data: { name, isPublic },
    });
    res.status(201).json(dashboard);
  } catch (error) {
    console.error('Error creating dashboard:', error);
    res.status(500).json({ error: 'Failed to create dashboard' });
  }
};

export const getDashboards = async (_req: Request, res: Response) => {
  try {
    const dashboards = await prisma.dashboard.findMany();
    res.json(dashboards);
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.status(500).json({ error: 'Failed to fetch dashboards' });
  }
};

export const getDashboardDetails = async (req: Request, res: Response) => {
  try {
    const { dashboardId } = req.params;
    const dashboard = await prisma.dashboard.findUnique({
      where: { id: Number(dashboardId) },
      include: {
        charts: true,
        kpis: {
          include: { expression: true },
        },
        filters: true,
      },
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard details:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard details' });
  }
};

export const getDashboardDetailsWithFilters = async (req: Request, res: Response) => {
  try {
    const { dashboardId } = req.params;
    const { filterId } = req.query;

    const dashboard = await prisma.dashboard.findUnique({
      where: { id: Number(dashboardId) },
      include: {
        charts: true,
        kpis: {
          include: { expression: true },
        },
        filters: true,
      },
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    let { charts, kpis, filters } = dashboard;

    if (filterId) {
      const filter = filters.find(f => f.id === Number(filterId));

      if (!filter) {
        return res.status(404).json({ error: 'Filter not found or not associated with the specified dashboard' });
      }

      const parser = new Parser();
      const parsedExpression = parser.parse(filter.query);

      const filteredDataPerKpi: { [key: number]: { value: number }[] } = {};

      charts = charts.map((chart) => {
        try {
          if (Array.isArray(chart.data)) {
            const variables = parsedExpression.variables();
            const dataContainsVariables = chart.data.some(item =>
              typeof item === 'object' && item !== null &&
              variables.every(variable => variable in item)
            );

            if (dataContainsVariables) {
              chart.data = chart.data.filter((item: any) => {
                const shouldInclude = parsedExpression.evaluate(item);

                kpis.forEach(kpi => {
                  if (!filteredDataPerKpi[kpi.id]) {
                    filteredDataPerKpi[kpi.id] = [];
                  }

                  if (shouldInclude && item[chart.yAxis] !== undefined) {
                    filteredDataPerKpi[kpi.id].push({ value: item[chart.yAxis] });
                  }
                });

                return shouldInclude;
              });
            }
          }
        } catch (err) {
          console.error(`Failed to apply filter on chart ${chart.id}`, err);
        }
        return chart;
      });

      kpis = await Promise.all(
        kpis.map(async (kpi) => {
          try {
            const dataForKpi = filteredDataPerKpi[kpi.id] || [];
            kpi.value = recalculateKpiValue(kpi.expression.formula, dataForKpi);
          } catch (error) {
            console.error(`Error applying filter ${filter.id} on KPI ${kpi.id}`, error);
          }
          return kpi;
        })
      );
    }

    res.json({ charts, kpis, filters });
  } catch (error) {
    console.error('Error fetching dashboard details:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard details' });
  }
};

const recalculateKpiValue = (formula: string, data: { value: number }[]): number => {
  if (formula === 'SUM(value)') {
    return data.reduce((acc, item) => acc + item.value, 0);
  } else if (formula === 'AVG(value)') {
    return data.reduce((acc, item) => acc + item.value, 0) / data.length;
  } else if (formula === 'COUNT(value)') {
    return data.length;
  } else if (formula === 'MAX(value)') {
    return Math.max(...data.map(item => item.value));
  } else if (formula === 'MIN(value)') {
    return Math.min(...data.map(item => item.value));
  } else {
    throw new Error(`Unsupported formula: ${formula}`);
  }
};
