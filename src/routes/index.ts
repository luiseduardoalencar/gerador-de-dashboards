// src/routes/index.ts
import { Router } from 'express';
import chartRoutes from './chartRoutes';
import dashboardRoutes from './dashboardRoutes';
import filterRoutes from './filterRoutes';
import kpiRoutes from './kpiRoutes';


const router = Router();

router.use('/dashboards', dashboardRoutes);
router.use('/charts', chartRoutes);
router.use('/kpis', kpiRoutes);
router.use('/filters', filterRoutes);

export default router;
