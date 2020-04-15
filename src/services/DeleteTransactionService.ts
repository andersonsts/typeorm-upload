import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransacitonRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransacitonRepository);

    const transactionsExists = await transactionsRepository.findOne(id);

    if (!transactionsExists) {
      throw new AppError('Transaction does not exists.');
    }

    await transactionsRepository.remove(transactionsExists);
  }
}

export default DeleteTransactionService;
