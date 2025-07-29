export class DeleteUserUseCase {
    constructor(postgresDeletedUserRepository) {
        this.postgresDeletedUserRepository = postgresDeletedUserRepository;
    }
    async execute(userId) {
        const deletedUser =
            await this.postgresDeletedUserRepository.execute(userId);

        return deletedUser;
    }
}
