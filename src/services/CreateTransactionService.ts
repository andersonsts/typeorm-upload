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

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const createdCategory = categoryRepository.create({
        title: category,
      });

      savedCategory = await categoryRepository.save(createdCategory);
    } else {
      savedCategory = categoryExists;
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError(
        'You dont have enough balance to make this transaction',
      );
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: savedCategory,
    });

    const transactionCreated = await transactionsRepository.save(transaction);

    delete transactionCreated.updated_at;
    delete transactionCreated.created_at;
    delete transactionCreated.category_id;
    delete transactionCreated.category.created_at;
    delete transactionCreated.category.updated_at;

    return transactionCreated;
  }
}

export default CreateTransactionService;
