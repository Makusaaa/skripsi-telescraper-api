import { Router } from 'express';

import ChannelRoute from './channel.route';
import MessageRoute from './message.route';
import AuthRoute from './auth.route';

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
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;