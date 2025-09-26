import { Router } from 'express';
import { getCalc, postCalc } from '../controllers/calcController.js';

const router = Router();

router.get('/', getCalc);
router.post('/', postCalc);

export default router;
