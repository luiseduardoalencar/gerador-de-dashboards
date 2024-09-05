// src/routes/chartRoutes.ts
import { Router } from 'express';
import { createChart, getChartDetails, getCharts, getChartsWithFilters } from '../controllers/chartController';

const router = Router();

router.post('/', createChart);
router.get('/', getCharts);
router.get('/with-filters', getChartsWithFilters);
router.get('/:chartId/details', getChartDetails);

export default router;
