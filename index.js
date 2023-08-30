import express from 'express';
import { mainRouter } from './src/routes/index.js';
import { defaultController } from './src/controllers/index.js';

const PORT = 3000;

const init = () => {
	const app = express();
	app.use(express.json());

	app.use('/', mainRouter);

	app.use('*', defaultController.routeNotFound);

	app.listen(PORT, () => {
		console.log(`app running on port ${PORT}`);
	});
};

init();
