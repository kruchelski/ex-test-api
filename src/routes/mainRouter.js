import express from 'express';

import { mainController } from '../controllers/index.js';
import utils from '../utils/index.js';

const mainRouter = express.Router();

const { checkHealth, listAccounts, resetAccounts, getBalance, processAccountEvent } =
	mainController;

const ROUTES = [
	{ path: '/health', method: 'get', controller: checkHealth },
	{ path: '/account', method: 'get', controller: listAccounts },
	{ path: '/reset', method: 'post', controller: resetAccounts },
	{ path: '/balance', method: 'get', controller: getBalance },
	{ path: '/event', method: 'post', controller: processAccountEvent },
];

utils.routes.registerRoutes(mainRouter, ROUTES);

export default mainRouter;
export { ROUTES as mainRoutes };
