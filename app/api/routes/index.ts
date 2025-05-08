import { Router } from 'express';

import ChannelRoute from './channel.route';
import MessageRoute from './message.route';
import AuthRoute from './auth.route';
import CompanyRoute from './company.route';
import UsersRoute from './users.route';
import KeywordsRoute from './keywords.route';

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
    {
        path: '/users',
        route: UsersRoute,
    },
    {
        path: '/keywords',
        route: KeywordsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;