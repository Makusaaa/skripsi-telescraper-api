import { Router } from 'express';

import ChannelRoute from './channel.route';
import MessageRoute from './message.route';

const router = Router();

const defaultRoutes = [
    {
        path: '/',
        route: ChannelRoute,
    },
    {
        path: '/',
        route: MessageRoute,
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;