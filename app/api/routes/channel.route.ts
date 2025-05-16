import { Router } from 'express';

import * as channelController from '../controllers/channel.controller';
import auth from '../middleware/auth.middleware';
import rolecheck from '../middleware/role-check.middleware';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/', auth, rolecheck([Roles.SuperAdmin]), channelController.getChannelListController);
router.post('/', auth, rolecheck([Roles.SuperAdmin]), channelController.joinChannelController);
router.delete('/', auth, rolecheck([Roles.SuperAdmin]), channelController.leaveChannelController);

export default router;