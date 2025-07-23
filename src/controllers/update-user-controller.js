import { EmailAlreadyInUseError } from '../errors/user.js';
import { UpdateUserUseCase } from '../use-cases/update-user-use-case.js';
import { badRequest, ok, serverError } from './helpers.js';
import validator from 'validator';

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const updateParams = httpRequest.body;
            // verificar se o userId é valido
            const userId = httpRequest.params.userId;

            const isIdValid = validator.isUUID(userId);

            if (!isIdValid) {
                return badRequest({
                    message: 'The provided ID is not valid.',
                });
            }

            // verificar se algum campo não permitido foi passado
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const someFieldIsNotAllowed = Object.keys(updateParams).some(
                (field) => {
                    !allowedFields.includes(field);
                }
            );

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                });
            }

            // verificar tamanho da senha
            if (updateParams.password) {
                const passwordIdNotValid = updateParams.password.length < 6;
                if (passwordIdNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters.',
                    });
                }
            }

            // verificar se o e-mail é valido
            if (updateParams.email) {
                const emailIsValid = validator.isEmail(updateParams.email);

                if (!emailIsValid) {
                    return badRequest({
                        message: 'Invalid e-mail. Please provide a valid one.',
                    });
                }
            }

            const updateUserUseCase = new UpdateUserUseCase();

            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateParams
            );

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({
                    message: error.message,
                });
            }
            console.error(error);
            return serverError();
        }
    }
}
