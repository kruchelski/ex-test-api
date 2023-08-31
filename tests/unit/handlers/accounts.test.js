import { accountsHandler, Account } from '../../../src/handlers';

describe('Tests the AccountsHandler methods and behaviors', () => {
	beforeEach(() => {
		accountsHandler.accounts = [];
	});

	it('should have zero accounts in the initial state', () => {
		expect(accountsHandler.accounts.length).toBe(0);
	});

	describe('Tests the findAccountById method', () => {
		it('should return a falsy value if an account is not found', () => {
			expect(accountsHandler.findAccountById('123')).toBeFalsy();
		});

		it('should return an account if an existing id is provided', () => {
			const accountDetails = { id: '182', balance: 500 };
			accountsHandler.addAccount(accountDetails);
			expect(accountsHandler.findAccountById('182')).toEqual(accountDetails);
		});
	});

	describe('Tests the addAccount method', () => {
		it('should add an account', () => {
			const accountDetails = { id: '182', balance: 300 };
			expect(accountsHandler.accounts.length).toBe(0);
			accountsHandler.addAccount(accountDetails);
			expect(accountsHandler.accounts.length).toBe(1);
			expect(accountsHandler.findAccountById('182')).toEqual(accountDetails);
		});

		it('should return the existing account if trying to add account with existing id', () => {
			const accountDetails = { id: '182', balance: 100 };
			accountsHandler.addAccount(accountDetails);
			const addedAccount = accountsHandler.addAccount({ id: '182', balance: 200 });
			expect(addedAccount).toEqual(accountDetails);
		});
	});

	describe('Tests the resetAccounts method', () => {
		it('should clear the accounts list', () => {
			const accountDetails = { id: '182', balance: 300 };
			accountsHandler.addAccount(accountDetails);
			expect(accountsHandler.accounts.length).toBe(1);
			accountsHandler.resetAccounts();
			expect(accountsHandler.accounts.length).toBe(0);
		});
	});

	describe('Tests the listAccounts method', () => {
		it('should return an empty array if there are no accounts added', () => {
			expect(accountsHandler.accounts).toEqual([]);
		});

		it('should return a list of the added accounts', () => {
			const accountsToAdd = [
				{ id: '123', balance: 100 },
				{ id: '456', balance: 100 },
			];
			accountsToAdd.forEach((account) => accountsHandler.addAccount(account));
			expect(accountsHandler.listAccounts()).toEqual(accountsToAdd);
		});
	});

	describe('Tests the getBalanceFromAccount method', () => {
		it('should return null if the a non exsisting id is provided', () => {
			expect(accountsHandler.getBalanceFromAccount('123')).toBe(null);
		});

		it('should return the balance of an existing account as a number', () => {
			const accountDetails = { id: '182', balance: 350 };
			accountsHandler.addAccount(accountDetails);
			const balance = accountsHandler.getBalanceFromAccount(accountDetails.id);
			expect(typeof balance).toBe('number');
			expect(balance).toBe(accountDetails.balance);
		});
	});

	describe('Tests the deposit method', () => {
		it('should add an acount if a deposit is made to a non existing account', () => {
			const depositDetails = { id: '182', value: 140 };
			expect(accountsHandler.accounts.length).toBe(0);
			accountsHandler.deposit(depositDetails.id, depositDetails.value);
			expect(accountsHandler.accounts.length).toBe(1);
			expect(accountsHandler.findAccountById(depositDetails.id)).toEqual({
				id: depositDetails.id,
				balance: depositDetails.value,
			});
		});

		it("should increase an accounts's balance if a deposit to an existing id is made", () => {
			const accountDetails = { id: '182', balance: 300 };
			const depositDetails = { id: '182', value: 200 };
			accountsHandler.addAccount(accountDetails);
			accountsHandler.deposit(depositDetails.id, depositDetails.value);
			const finalBalance = accountDetails.balance + depositDetails.value;
			expect(accountsHandler.getBalanceFromAccount(accountDetails.id)).toBe(finalBalance);
		});
	});

	describe('tests the withdraw method', () => {
		it('should return null if a non existing id is provided', () => {
			expect(accountsHandler.withdraw('123', 100)).toBe(null);
		});

		it('should subtract the value from the balance of an existing account', () => {
			const accountDetails = { id: '182', balance: 300 };
			const withdrawDetails = { id: '182', value: 200 };
			accountsHandler.addAccount(accountDetails);
			accountsHandler.withdraw(withdrawDetails.id, withdrawDetails.value);
			const finalBalance = accountDetails.balance - withdrawDetails.value;
			expect(accountsHandler.getBalanceFromAccount(accountDetails.id)).toBe(finalBalance);
		});
	});

	describe('tests the transfer method', () => {
		it('should return null if a transfer is made from a non existing account', () => {
			expect(accountsHandler.transfer('123', '321', 100)).toBe(null);
		});

		it('should add an account if a transfer is made to a non existing account', () => {
			const originAccount = { id: '123', balance: 200 };
			accountsHandler.addAccount(originAccount);
			expect(accountsHandler.accounts.length).toBe(1);
			const transferDetails = { origin: originAccount.id, destination: '321', value: 100 };
			accountsHandler.transfer(
				transferDetails.origin,
				transferDetails.destination,
				transferDetails.value
			);
			expect(accountsHandler.accounts.length).toBe(2);
			const accountAdded = { id: transferDetails.destination, balance: transferDetails.value };
			expect(accountsHandler.findAccountById(accountAdded.id)).toEqual(accountAdded);
		});

		it('should alter the balances of the origin and destination account', () => {
			const originAccount = { id: '123', balance: 200 };
			const destinationAccount = { id: '321', balance: 50 };
			accountsHandler.addAccount(originAccount);
			accountsHandler.addAccount(destinationAccount);
			const transferDetails = {
				origin: originAccount.id,
				destination: destinationAccount.id,
				value: 100,
			};
			const originFinalBalance = originAccount.balance - transferDetails.value;
			const destinationFinalBalance = destinationAccount.balance + transferDetails.value;
			accountsHandler.transfer(
				transferDetails.origin,
				transferDetails.destination,
				transferDetails.value
			);
			expect(accountsHandler.getBalanceFromAccount(originAccount.id)).toBe(originFinalBalance);
			expect(accountsHandler.getBalanceFromAccount(destinationAccount.id)).toBe(
				destinationFinalBalance
			);
		});
	});
});

describe('Tests Account methods and behavior', () => {
	describe('tests addValue method', () => {
		const initialAccountDetails = { id: '111', balance: 100 };
		const account = new Account(initialAccountDetails);

		it('should increase the balance of the account', () => {
			expect(account.balance).toBe(initialAccountDetails.balance);
			const valueToAdd = 100;
			account.addValue(valueToAdd);
			expect(account.balance).toBe(initialAccountDetails.balance + valueToAdd);
		});
	});

	describe('tests subtractValue method', () => {
		const initialAccountDetails = { id: '111', balance: 100 };
		const account = new Account(initialAccountDetails);

		it('should reduce the balance of the account', () => {
			expect(account.balance).toBe(initialAccountDetails.balance);
			const valueToSubtract = 100;
			account.subtractValue(valueToSubtract);
			expect(account.balance).toBe(initialAccountDetails.balance - valueToSubtract);
		});
	});
});
