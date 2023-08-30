import { accountsHandler } from '../handlers/index.js';

const DEFAULT_ERROR_MSG = 'Internal server error';

const checkHealth = (_, res) => {
	try {
		res.status(200).send('Server is up and running');
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const resetAccounts = (_, res) => {
	try {
		accountsHandler.resetAccounts();
		res.status(200).send('OK');
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const listAccounts = (_, res) => {
	try {
		res.status(200).send(accountsHandler.listAccounts());
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const getBalance = (req, res) => {
	try {
		if (!req?.query?.account_id) return res.status(400).send('account_id not provided');
		const id = req.query.account_id;
		const balance = accountsHandler.getBalanceFromAccount(id);
		if (balance === null) return res.status(404).json(0);
		res.status(200).json(balance);
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const depositValue = (req, res) => {
	try {
		const {
			body: { destination, amount },
		} = req;
		if (destination === undefined) return res.status(400).send('destination not provided');
		if (amount === undefined) return res.status(400).send('amount not provided');
		const account = accountsHandler.deposit(destination, amount);
		res.status(201).send({ destination: account });
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const withdrawValue = (req, res) => {
	try {
		const {
			body: { origin, amount },
		} = req;
		if (origin === undefined) return res.status(400).send('origin not provided');
		if (amount === undefined) return res.status(400).send('amount not provided');
		const account = accountsHandler.withdraw(origin, amount);
		if (!account) return res.status(404).json(0);
		res.status(201).send({ origin: account });
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const transferValue = (req, res) => {
	try {
		const {
			body: { origin, amount, destination },
		} = req;
		if (origin === undefined) return res.status(400).send('origin not provided');
		if (amount === undefined) return res.status(400).send('amount not provided');
		if (destination === undefined) return res.status(400).send('destination not provided');
		const transferResult = accountsHandler.transfer(origin, destination, amount);
		if (!transferResult) return res.status(404).json(0);
		const { originAccount, destinationAccount } = transferResult;
		res.status(201).send({ origin: originAccount, destination: destinationAccount });
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

const processAccountEvent = (req, res) => {
	try {
		const {
			body: { type },
		} = req;
		if (!type) return res.status(400).send('type not provided');

		const allProcesses = {
			deposit: depositValue,
			withdraw: withdrawValue,
			transfer: transferValue,
		};

		const eventProcessor = allProcesses[type];
		if (!eventProcessor) return res.status(400).send('type is not valid');

		eventProcessor(req, res);
	} catch (error) {
		const message = error.message || DEFAULT_ERROR_MSG;
		res.status(500).send(message);
	}
};

export {
	checkHealth,
	listAccounts,
	resetAccounts,
	getBalance,
	processAccountEvent,
	depositValue,
	withdrawValue,
	transferValue,
};
