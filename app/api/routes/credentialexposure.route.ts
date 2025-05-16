import { Router } from 'express';

import * as credentialexposuresController from '../controllers/credentialexposure.controller';
import auth from '../middleware/auth.middleware';
import rolecheck from '../middleware/role-check.middleware';
import { Roles } from '../constraints/constants';

const router = Router();

router.get('/', auth, rolecheck([Roles.SuperAdmin, Roles.CompanyAdmin, Roles.User]), credentialexposuresController.getCredentialExposureListController);

export default router;