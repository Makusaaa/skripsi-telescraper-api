import { Router } from 'express';

import ChannelRoute from './channel.route';
import MessageRoute from './message.route';
import AuthRoute from './auth.route';
import CompanyRoute from './company.route';

const router = Router();

const defaultRoutes = [
    {
        path: '/channel',
        route: ChannelRoute,
    },
    {
        path: '/message',
        route: MessageRoute,
    },
    {
        path: '/auth',
        route: AuthRoute,
    },
    {
        path: '/company',
        route: CompanyRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;