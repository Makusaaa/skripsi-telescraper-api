import { Router } from 'express';

import * as messageController from '../controllers/message.controller';
import auth from '../middleware/auth';
import rolecheck from '../middleware/rolecheck';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/send', auth, rolecheck([Roles.SuperAdmin]), messageController.send);

export default router;