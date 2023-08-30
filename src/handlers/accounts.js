class Account {
	constructor({ id, balance }) {
		this.id = id;
		this.balance = balance;
	}

	addValue(value) {
		this.balance += value;
	}

	subtractValue(value) {
		this.balance -= value;
	}
}

class AccountsHandler {
	constructor() {
		this.accounts = [];
	}

	findAccountById(id) {
		return this.accounts.find((account) => account.id === id);
	}

	addAccount(accountDetails) {
		const { id } = accountDetails;
		const existingAccount = this.findAccountById(id);
		if (existingAccount) return existingAccount;
		const account = new Account(accountDetails);
		this.accounts.push(account);
		return account;
	}

	resetAccounts() {
		this.accounts = [];
	}

	listAccounts() {
		return this.accounts;
	}

	getBalanceFromAccount(id) {
		const account = this.findAccountById(id);
		if (!account) return null;
		return account.balance;
	}

	deposit(id, value) {
		const account = this.findAccountById(id);
		if (!account) {
			return this.addAccount({ id, balance: value });
		}
		account.addValue(value);
		return account;
	}

	withdraw(id, value) {
		const account = this.findAccountById(id);
		if (!account) return null;
		account.subtractValue(value);
		return account;
	}

	transfer(origin, destination, value) {
		const originAccount = this.withdraw(origin, value);

		if (originAccount === null) return null;
		const destinationAccount = this.deposit(destination, value);
		return { originAccount, destinationAccount };
	}
}

const accountsHandler = new AccountsHandler();
export default accountsHandler;
export { Account };
