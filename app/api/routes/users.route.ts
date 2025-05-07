import { Router } from 'express';

import * as usersController from '../controllers/users.controller';
import auth from '../middleware/auth.middleware';
import rolecheck from '../middleware/role-check.middleware';
import { Roles } from '../constraints/constants';

const router = Router();

router.post('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin]), usersController.registerUserController);

export default router;