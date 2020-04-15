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
    const filePath = path.join(uploadConfig.directory, fileName);
    const createTransaction = new CreateTransactionService();

    const transactions = await csv().fromFile(filePath);

    const transactionsCreated = transactions.map(
      async ({ title, type, value, category }) => {
        await createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      },
    );

    return transactionsCreated;
  }
}

export default ImportTransactionsService;
