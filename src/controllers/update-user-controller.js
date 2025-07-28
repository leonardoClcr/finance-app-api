import { EmailAlreadyInUseError } from '../errors/user.js';
import { UpdateUserUseCase } from '../use-cases/update-user-use-case.js';
import { badRequest, ok, serverError } from './helpers/http.js';
import validator from 'validator';
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailAlreadyInUseResponse,
    invalidIdResponse,
    invalidPasswordResponse,
} from './helpers/user.js';

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const updateParams = httpRequest.body;
            // verificar se o userId é valido
            const userId = httpRequest.params.userId;

            const isIdValid = validator.isUUID(userId);

            if (!isIdValid) {
                return invalidIdResponse();
            }

            // verificar se algum campo não permitido foi passado
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const someFieldIsBlank = Object.keys(updateParams).some(
                (field) => updateParams[field].trim().length === 0
            );

            if (someFieldIsBlank) {
                return badRequest({ message: 'Some provided field is blank' });
            }

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
                const passwordIsValid = checkIfPasswordIsValid(
                    updateParams.password
                );
                if (!passwordIsValid) {
                    return invalidPasswordResponse();
                }

                // verificar se o e-mail é valido
                if (updateParams.email) {
                    const emailIsValid = checkIfEmailIsValid(
                        updateParams.email
                    );

                    if (!emailIsValid) {
                        return emailAlreadyInUseResponse();
                    }
                }

                const updateUserUseCase = new UpdateUserUseCase();

                const updatedUser = await updateUserUseCase.execute(
                    userId,
                    updateParams
                );

                return ok(updatedUser);
            }
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
