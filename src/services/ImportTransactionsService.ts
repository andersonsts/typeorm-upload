import path from 'path';
import csv from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  fileName: string;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const importedTransactions = [];

    const filePath = path.join(uploadConfig.directory, fileName);
    const createTransaction = new CreateTransactionService();

    const transactions = await csv().fromFile(filePath);

    const [
      importedTransaction1,
      importedTransaction2,
      importedTransaction3,
    ] = transactions;

    // importedTransactions = transactions.map(async transaction =>
    //   createTransaction.execute(transaction),
    // );

    const createdTransaction1 = await createTransaction.execute(
      importedTransaction1,
    );
    importedTransactions.push(createdTransaction1);
    const createdTransaction2 = await createTransaction.execute(
      importedTransaction2,
    );
    importedTransactions.push(createdTransaction2);
    const createdTransaction3 = await createTransaction.execute(
      importedTransaction3,
    );
    importedTransactions.push(createdTransaction3);

    return importedTransactions;
  }
}

export default ImportTransactionsService;
