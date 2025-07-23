import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email-repository.js';
import { EmailAlreadyInUseError } from '../errors/user.js';
import bcrypt from 'bcrypt';
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user-repository.js';

export class UpdateUserUseCase {
    async execute(userId, updateParams) {
        // se o e-mail estiver sendo atualizado, verificar se ele já esta em uso
        if (updateParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository();

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
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
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user
        );

        return updatedUser;
    }
}
