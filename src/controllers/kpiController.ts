import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { Parser } from 'expr-eval';

export const createKpi = async (req: Request, res: Response) => {
  try {
    const { name, expressionId, dashboardId } = req.body;

    console.log('Starting KPI creation with:', { name, expressionId, dashboardId });

    // Verificar se a expressão existe
    const expression = await prisma.expression.findUnique({
      where: { id: expressionId },
    });

    if (!expression) {
      console.error('Expression not found:', expressionId);
      return res.status(404).json({ error: 'Expression not found' });
    }

    console.log('Expression found:', expression);

    // Calcular o valor inicial do KPI
    const initialValue = await calculateKpiValue(expression.formula, dashboardId);
    console.log('Calculated initial KPI value:', initialValue);

    // Criar o KPI com o valor inicial
    const kpi = await prisma.kpi.create({
      data: { name, value: initialValue, expressionId, dashboardId },
    });

    console.log('KPI created successfully:', kpi);
    res.status(201).json(kpi);
  } catch (error) {
    console.error('Error creating KPI:', error);
    res.status(500).json({ error: 'Failed to create KPI' });
  }
};


export const getKpiDetails = async (req: Request, res: Response) => {
  try {
    const { kpiId } = req.params;
    const kpi = await prisma.kpi.findUnique({
      where: { id: Number(kpiId) },
      include: { expression: true },
    });

    if (!kpi) {
      return res.status(404).json({ error: 'KPI not found' });
    }

    res.json(kpi);
  } catch (error) {
    console.error('Error fetching KPI details:', error);
    res.status(500).json({ error: 'Failed to fetch KPI details' });
  }
};

const calculateKpiValue = async (formula: string, dashboardId: number): Promise<number> => {
  const data = await fetchDataForDashboard(dashboardId);

  // Verificar e aplicar a função de agregação correta
  if (formula === 'SUM(value)') {
    return data.reduce((acc, item) => acc + item.value, 0); // Soma todos os valores
  } else if (formula === 'AVG(value)') {
    return data.reduce((acc, item) => acc + item.value, 0) / data.length; // Calcula a média dos valores
  } else if (formula === 'COUNT(value)') {
    return data.length; // Conta a quantidade de itens
  } else if (formula === 'MAX(value)') {
    return Math.max(...data.map(item => item.value)); // Retorna o valor máximo
  } else if (formula === 'MIN(value)') {
    return Math.min(...data.map(item => item.value)); // Retorna o valor mínimo
  } else {
    throw new Error(`Unsupported formula: ${formula}`);
  }
};

// Função para buscar dados relacionados ao dashboard para cálculos
const fetchDataForDashboard = async (dashboardId: number): Promise<{ value: number }[]> => {
  // Exemplo básico de como buscar os charts e seus dados relacionados ao dashboard
  const charts = await prisma.chart.findMany({
    where: { dashboardId },
  });

  // Combine os dados dos charts para o cálculo
  let data: { value: number }[] = [];
  charts.forEach((chart) => {
    if (chart.data && Array.isArray(chart.data)) {
      chart.data.forEach((item: any) => {
        // Supondo que os valores que queremos somar estão na chave 'Sales'
        if (item.Sales !== undefined) {
          data.push({ value: item.Sales });
        }
      });
    }
  });

  return data;
};


export const getKpisWithFilters = async (req: Request, res: Response) => {
  try {
    const { dashboardId, filterId } = req.query;

    const kpis = await prisma.kpi.findMany({
      where: { dashboardId: Number(dashboardId) },
      include: { expression: true },  
    });

    
    const filters = await prisma.filter.findMany({
      where: { dashboardId: Number(dashboardId) },
    });

    const parser = new Parser();

    const filteredKpis = await Promise.all(
      kpis.map(async (kpi) => {
        await Promise.all(
          filters.map(async (filter) => {
            try {
              const parsedExpression = parser.parse(filter.query);
              if (parsedExpression.evaluate({})) {
                kpi.value = await calculateKpiValue(kpi.expression.formula, Number(dashboardId));
              }
            } catch (error) {
              console.error(`Error applying filter ${filter.id} on KPI ${kpi.id}`, error);
            }
          })
        );
        return kpi;
      })
    );

    res.json(filteredKpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs with filters' });
  }
};
