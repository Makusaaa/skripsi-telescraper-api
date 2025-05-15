import { Router } from 'express';

import * as alarmsController from '../controllers/alarms.controller';
import auth from '../middleware/auth.middleware';
import rolecheck from '../middleware/role-check.middleware';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin, Roles.User]), alarmsController.getAlarmListController);
router.patch('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin, Roles.User]), alarmsController.updateAlarmStatusController);

export default router;