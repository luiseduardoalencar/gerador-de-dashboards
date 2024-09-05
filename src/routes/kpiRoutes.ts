import { Router } from 'express';
import { createKpi, getKpiDetails, getKpisWithFilters } from '../controllers/kpiController';

const router = Router();

router.post('/', createKpi);
router.get('/with-filters', getKpisWithFilters);
router.get('/:kpiId/details', getKpiDetails);

export default router;
