import { Router } from 'express';
import { createFilter, getFilterDetails, getFilters } from '../controllers/filterController';

const router = Router();

router.post('/', createFilter);
router.get('/', getFilters);
router.get('/:filterId/details', getFilterDetails);

export default router;
