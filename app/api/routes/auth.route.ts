import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import auth from '../middleware/auth';
import rolecheck from '../middleware/rolecheck';
import { Roles } from '../constraints/constants.ts';

const router = Router();

router.post('/login', authController.login);
router.post('/access-superadmin', auth, rolecheck([Roles.SuperAdmin]), authController.access);
router.post('/access-companyadmin', auth, rolecheck([Roles.CompanyAdmin]), authController.access);
router.post('/access-user', auth, rolecheck([Roles.User]), authController.access);

export default router;