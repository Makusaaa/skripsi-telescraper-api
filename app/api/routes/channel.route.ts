import { Router } from 'express';

import * as channelController from '../controllers/channel.controller';
import auth from '../middleware/auth';
import rolecheck from '../middleware/rolecheck';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/join', auth, rolecheck([Roles.SuperAdmin]), channelController.join);
router.get('/leave', auth, rolecheck([Roles.SuperAdmin]), channelController.leave);

export default router;