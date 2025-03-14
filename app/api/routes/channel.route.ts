import { Router } from 'express';

import * as channelController from '../controllers/channel.controller';

const router = Router();

router.get('/join-channel', channelController.join);
router.get('/leave-channel', channelController.leave);

export default router;