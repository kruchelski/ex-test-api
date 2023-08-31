import { jest } from '@jest/globals';
import { mainController } from '../../../src/controllers';
import { accountsHandler } from '../../../src/handlers';

describe('Tests the mainController methods', () => {
	beforeEach(() => {
		accountsHandler.accounts = [];
		jest.restoreAllMocks();
	});

	const getMocks = () => {
		const mockSend = jest.fn((text) => text);
		const mockJson = jest.fn((data) => data);
		const mockStatus = jest.fn((code) => ({ send: mockSend, json: mockJson, code }));

		return { mockSend, mockJson, mockStatus };
	};

	describe('Tests the checkHealth method', () => {
		it('should return 200 and the message "Server is up and running" message', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			mainController.checkHealth(req, res);
			expect(mockStatus).toBeCalledWith(200);
			expect(mockSend).toBeCalledWith('Server is up and running');
		});
	});

	describe('Tests the resetAccounts method', () => {
		it('should return 200 and "OK" message', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			mainController.resetAccounts(req, res);
			expect(mockStatus).toBeCalledWith(200);
			expect(mockSend).toBeCalledWith('OK');
		});

		it('should call the resetAccounts method from the accountsHandler', () => {
			const spyFn = jest.spyOn(accountsHandler, 'resetAccounts');
			const { mockStatus } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			mainController.resetAccounts(req, res);
			expect(spyFn).toBeCalledTimes(1);
		});

		it('should clear the list in the accountsHandler', () => {
			const { mockStatus } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			accountsHandler.addAccount({ id: '123', balance: 500 });
			expect(accountsHandler.accounts.length).toBe(1);
			mainController.resetAccounts(req, res);
			expect(accountsHandler.accounts.length).toBe(0);
		});
	});

	describe('Tests the listAccounts method', () => {
		it('should return 200 and the accounts list', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			const accountsToAdd = [
				{ id: '123', balance: 300 },
				{ id: '321', balance: 500 },
			];
			accountsToAdd.forEach((account) => accountsHandler.addAccount(account));
			mainController.listAccounts(req, res);
			expect(mockStatus).toBeCalledWith(200);
			expect(mockSend).toBeCalledWith(accountsToAdd);
		});

		it('should call the listAccounts method from the accountsHandler', () => {
			const spyFn = jest.spyOn(accountsHandler, 'listAccounts');
			const { mockStatus } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			mainController.listAccounts(req, res);
			expect(spyFn).toBeCalledTimes(1);
		});
	});

	describe('Tests the getBalance method', () => {
		it('should return 400 and the message "account_id not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = {};
			const res = { status: mockStatus };
			mainController.getBalance(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('account_id not provided');
		});

		it('should return 404 and 0', () => {
			const { mockStatus, mockJson } = getMocks();
			const req = { query: { account_id: '123' } };
			const res = { status: mockStatus };
			mainController.getBalance(req, res);
			expect(mockStatus).toBeCalledWith(404);
			expect(mockJson).toBeCalledWith(0);
		});

		it('should return 200 and the value of the account', () => {
			const { mockStatus, mockJson } = getMocks();
			const accountDetails = { id: '123', balance: 200 };
			accountsHandler.addAccount(accountDetails);
			const req = { query: { account_id: accountDetails.id } };
			const res = { status: mockStatus };
			mainController.getBalance(req, res);
			expect(mockStatus).toBeCalledWith(200);
			expect(mockJson).toBeCalledWith(accountDetails.balance);
		});

		it('should call getBalanceFromAccount method from accountsHandler', () => {
			const { mockStatus } = getMocks();
			const spyFn = jest.spyOn(accountsHandler, 'getBalanceFromAccount');
			const req = { query: { account_id: '123' } };
			const res = { status: mockStatus };
			mainController.getBalance(req, res);
			expect(spyFn).toBeCalledTimes(1);
		});

		it('should return 500 and "Internal server error"', () => {
			const { mockStatus, mockSend } = getMocks();
			const mockedFunction = jest
				.spyOn(accountsHandler, 'getBalanceFromAccount')
				.mockImplementation(() => {
					throw new Error();
				});
			const req = { query: { account_id: '123' } };
			const res = { status: mockStatus };
			mainController.getBalance(req, res);
			expect(mockStatus).toBeCalledWith(500);
			expect(mockSend).toBeCalledWith('Internal server error');
			mockedFunction.mockRestore();
		});
	});

	describe('Tests processAccountEvent method', () => {
		it('should return 400 and "type not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: {} };
			const res = { status: mockStatus };
			mainController.processAccountEvent(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('type not provided');
		});

		it('should return 400 and "type is not valid"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: { type: 'test' } };
			const res = { status: mockStatus };
			mainController.processAccountEvent(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('type is not valid');
		});

		it('should return 500 and "Internal server error"', () => {
			const { mockStatus, mockSend } = getMocks();
			const mockedFunction = jest.spyOn(accountsHandler, 'deposit').mockImplementation(() => {
				throw new Error();
			});
			const req = { body: { type: 'deposit', destination: '123', amount: 100 } };
			const res = { status: mockStatus };
			mainController.processAccountEvent(req, res);
			expect(mockStatus).toBeCalledWith(500);
			expect(mockSend).toBeCalledWith('Internal server error');
			mockedFunction.mockRestore();
		});
	});

	describe('Tests depositValue method', () => {
		it('should return 400 and the message "destination not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: {} };
			const res = { status: mockStatus };
			mainController.depositValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('destination not provided');
		});

		it('should return 400 and the message "amount not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: { destination: '123' } };
			const res = { status: mockStatus };
			mainController.depositValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('amount not provided');
		});

		it('should return 201 and the account that the deposit is made', () => {
			const { mockStatus, mockSend } = getMocks();
			const depositDetails = { id: '123', amount: 8787 };
			const req = { body: { destination: depositDetails.id, amount: depositDetails.amount } };
			const res = { status: mockStatus };
			mainController.depositValue(req, res);
			expect(mockStatus).toBeCalledWith(201);
			expect(mockSend).toBeCalledWith({
				destination: { id: depositDetails.id, balance: depositDetails.amount },
			});
		});

		it('should call deposit method from accountsHandler', () => {
			const { mockStatus } = getMocks();
			const spyFn = jest.spyOn(accountsHandler, 'deposit');
			const req = { body: { destination: '123', amount: 100 } };
			const res = { status: mockStatus };
			mainController.depositValue(req, res);
			expect(spyFn).toBeCalledTimes(1);
		});

		it('should return 500 and "Internal server error"', () => {
			const { mockStatus, mockSend } = getMocks();
			const mockedFunction = jest.spyOn(accountsHandler, 'deposit').mockImplementation(() => {
				throw new Error();
			});
			const req = { body: { destination: '123', amount: 333 } };
			const res = { status: mockStatus };
			mainController.depositValue(req, res);
			expect(mockStatus).toBeCalledWith(500);
			expect(mockSend).toBeCalledWith('Internal server error');
			mockedFunction.mockRestore();
		});
	});

	describe('Tests withdrawValue method', () => {
		it('should return 400 and the message "origin not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: {} };
			const res = { status: mockStatus };
			mainController.withdrawValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('origin not provided');
		});

		it('should return 400 and the message "amount not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: { origin: '123' } };
			const res = { status: mockStatus };
			mainController.withdrawValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('amount not provided');
		});

		it('should return 404 and the 0', () => {
			const { mockStatus, mockJson } = getMocks();
			const req = { body: { origin: '123', amount: 100 } };
			const res = { status: mockStatus };
			mainController.withdrawValue(req, res);
			expect(mockStatus).toBeCalledWith(404);
			expect(mockJson).toBeCalledWith(0);
		});

		it('should return 201 and the account that the withdraw is made', () => {
			const { mockStatus, mockSend } = getMocks();
			const initialAccount = { id: '123', balance: 400 };
			accountsHandler.addAccount(initialAccount);
			const withdrawDetails = { id: '123', amount: 150 };
			const req = { body: { origin: withdrawDetails.id, amount: withdrawDetails.amount } };
			const res = { status: mockStatus };
			mainController.withdrawValue(req, res);
			expect(mockStatus).toBeCalledWith(201);
			expect(mockSend).toBeCalledWith({
				origin: {
					id: withdrawDetails.id,
					balance: initialAccount.balance - withdrawDetails.amount,
				},
			});
		});

		it('should call withdraw method from accountsHandler', () => {
			const { mockStatus } = getMocks();
			const spyFn = jest.spyOn(accountsHandler, 'withdraw');
			const req = { body: { origin: '123', amount: 100 } };
			const res = { status: mockStatus };
			mainController.withdrawValue(req, res);
			expect(spyFn).toBeCalledTimes(1);
		});

		it('should return 500 and "Internal server error"', () => {
			const { mockStatus, mockSend } = getMocks();
			const mockedFunction = jest.spyOn(accountsHandler, 'withdraw').mockImplementation(() => {
				throw new Error();
			});
			const req = { body: { origin: '123', amount: 333 } };
			const res = { status: mockStatus };
			mainController.withdrawValue(req, res);
			expect(mockStatus).toBeCalledWith(500);
			expect(mockSend).toBeCalledWith('Internal server error');
			mockedFunction.mockRestore();
		});
	});

	describe('Tests transferValue method', () => {
		it('should return 400 and the message "origin not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: {} };
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('origin not provided');
		});

		it('should return 400 and the message "amount not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: { origin: '123' } };
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('amount not provided');
		});

		it('should return 400 and the message "destination not provided"', () => {
			const { mockStatus, mockSend } = getMocks();
			const req = { body: { origin: '123', amount: 100 } };
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(mockStatus).toBeCalledWith(400);
			expect(mockSend).toBeCalledWith('destination not provided');
		});

		it('should return 404 and the 0', () => {
			const { mockStatus, mockJson } = getMocks();
			const req = { body: { origin: '989', amount: 100, destination: '898' } };
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(mockStatus).toBeCalledWith(404);
			expect(mockJson).toBeCalledWith(0);
		});

		it('should return 201 and the accounts of the transfer', () => {
			const { mockStatus, mockSend } = getMocks();
			const accounts = [
				{ id: '123', balance: 300 },
				{ id: '321', balance: 100 },
			];
			accounts.forEach((account) => accountsHandler.addAccount(account));
			const [origin, destination] = accounts;
			const transferDetails = { origin: '123', amount: 50, destination: '321' };
			const req = {
				body: transferDetails,
			};
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(mockStatus).toBeCalledWith(201);
			expect(mockSend).toBeCalledWith({
				origin: { id: origin.id, balance: origin.balance - transferDetails.amount },
				destination: { id: destination.id, balance: destination.balance + transferDetails.amount },
			});
		});

		it('should call transfer method from accountsHandler', () => {
			const { mockStatus } = getMocks();
			const spyFn = jest.spyOn(accountsHandler, 'transfer');
			const req = { body: { origin: '123', amount: 100, destination: '321' } };
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(spyFn).toBeCalledTimes(1);
		});

		it('should return 500 and "Internal server error"', () => {
			const { mockStatus, mockSend } = getMocks();
			const mockedFunction = jest.spyOn(accountsHandler, 'transfer').mockImplementation(() => {
				throw new Error();
			});
			const req = { body: { origin: '123', amount: 333, destination: '321' } };
			const res = { status: mockStatus };
			mainController.transferValue(req, res);
			expect(mockStatus).toBeCalledWith(500);
			expect(mockSend).toBeCalledWith('Internal server error');
			mockedFunction.mockRestore();
		});
	});
});
