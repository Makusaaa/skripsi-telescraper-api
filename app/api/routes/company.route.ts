import { Router } from 'express';

import * as companyController from '../controllers/company.controller';
import auth from '../middleware/auth.middleware.ts';
import rolecheck from '../middleware/role-check.middleware.ts';
import { Roles } from '../constraints/constants.ts';

const router = Router();

router.get('/', auth, rolecheck([Roles.SuperAdmin]), companyController.getCompanyListController);
router.get('/:id', auth, rolecheck([Roles.SuperAdmin]), companyController.getCompanyByIDController);
router.post('/', auth, rolecheck([Roles.SuperAdmin]), companyController.registerCompanyController);
router.delete('/', auth, rolecheck([Roles.SuperAdmin]), companyController.deleteCompanyController);

export default router;