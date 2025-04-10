import { Router } from 'express';

import * as messageController from '../controllers/message.controller';
import auth from '../middleware/auth.middleware';
import rolecheck from '../middleware/role-check.middleware';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/send', auth, rolecheck([Roles.SuperAdmin]), messageController.send);

export default router;