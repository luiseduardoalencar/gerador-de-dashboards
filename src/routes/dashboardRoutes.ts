import { Router } from 'express';
import { createDashboard, getDashboardDetails, getDashboardDetailsWithFilters, getDashboards } from '../controllers/dashboardController';

const router = Router();

router.post('/', createDashboard);
router.get('/', getDashboards);
router.get('/:dashboardId/details', getDashboardDetailsWithFilters); 
router.get('/:dashboardId/', getDashboardDetails);

export default router;
