import { Router } from 'express';

import * as channelController from '../controllers/channel.controller';

const router = Router();

router.get('/join', channelController.join);
router.get('/leave', channelController.leave);

export default router;