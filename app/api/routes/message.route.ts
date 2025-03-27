import { Router } from 'express';

import * as messageController from '../controllers/message.controller';

const router = Router();

router.get('/send', messageController.send);

export default router;