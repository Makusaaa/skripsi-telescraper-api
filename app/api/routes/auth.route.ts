import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import auth from '../middleware/auth';
import rolecheck from '../middleware/rolecheck';

const router = Router();

router.post('/login', authController.login);
router.post('/access', auth, rolecheck([0,1]), authController.access);

export default router;