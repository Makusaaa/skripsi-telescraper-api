import { Router } from 'express';

import * as keywordsController from '../controllers/keywords.controller';
import auth from '../middleware/auth.middleware';
import rolecheck from '../middleware/role-check.middleware';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin]), keywordsController.getKeywordListController);
router.post('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin]), keywordsController.registerKeywordController);
router.delete('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin]), keywordsController.deleteKeywordController);

export default router;