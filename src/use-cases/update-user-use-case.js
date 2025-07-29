import { EmailAlreadyInUseError } from '../errors/user.js';
import bcrypt from 'bcrypt';

export class UpdateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository
    ) {
        ((this.postgresGetUserByEmailRepository =
            postgresGetUserByEmailRepository),
            (this.postgresUpdateUserRepository = postgresUpdateUserRepository));
    }
    async execute(userId, updateParams) {
        // se o e-mail estiver sendo atualizado, verificar se ele já esta em uso
        if (updateParams.email) {
            const userWithProvidedEmail =
                await this.postgresGetUserByEmailRepository.execute(
                    updateParams.email
                );
            if (userWithProvidedEmail && userWithProvidedEmail.id != userId) {
                throw new EmailAlreadyInUseError(updateParams.email);
            }
        }

        const user = {
            ...updateParams,
        };

        // se a senha estiver sendo atualizada, criptografa-la
        if (updateParams.password) {
            const hashedPassword = await bcrypt.hash(updateParams.password, 10);

            user.password = hashedPassword;
        }
        // chamar o repository para atualizar o usuario
        const updatedUser = await this.postgresUpdateUserRepository.execute(
            userId,
            user
        );

        return updatedUser;
    }
}
