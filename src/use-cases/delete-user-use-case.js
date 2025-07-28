import { PostgresDeleteUserRepository } from '../repositories/postgres/delete-user-repository.js';

export class DeleteUserUseCase {
    async execute(userId) {
        const postgresDeletedUserRepository =
            new PostgresDeleteUserRepository();
        const deletedUser = await postgresDeletedUserRepository.execute(userId);

        return deletedUser;
    }
}
