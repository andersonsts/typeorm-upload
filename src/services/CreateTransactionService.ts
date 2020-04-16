import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    let savedCategory;

    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const wantedCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError(
        'You dont have enough balance to make this transaction',
      );
    }

    if (wantedCategory) {
      savedCategory = wantedCategory;
    } else {
      const createdCategory = await categoryRepository.create({
        title: category,
      });

      savedCategory = await categoryRepository.save(createdCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: savedCategory,
    });

    const transactionCreated = await transactionsRepository.save(transaction);

    return transactionCreated;
  }
}

export default CreateTransactionService;
