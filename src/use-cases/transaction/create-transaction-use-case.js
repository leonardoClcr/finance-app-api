import { UserNotFoundError } from '../../errors/user';
import { v4 as uuidv4 } from 'uuid';

export class CreateTransactionUseCase {
    constructor(
        postgresCreateTransactionRepository,
        postgresGetUserByIdRepository
    ) {
        ((this.postgresCreateTransactionRepository =
            postgresCreateTransactionRepository),
            (this.postgresGetUserByIdRepository =
                postgresGetUserByIdRepository));
    }
    async execute(createTransactionParams) {
        // validar se o usuario existe
        const userId = createTransactionParams.userId;
        const user = await this.postgresGetUserByIdRepository.execute(userId);

        if (!user) {
            throw new UserNotFoundError(userId);
        }

        const transactionId = uuidv4();

        const transaction =
            await this.postgresCreateTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            });

        return transaction;
    }
}
