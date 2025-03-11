import { Router } from 'express';

const router = Router();

const defaultRoutes = [
    {
        path: '',
        route: '',
    }

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;