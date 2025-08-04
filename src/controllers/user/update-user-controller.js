import { EmailAlreadyInUseError } from '../../errors/user.js';
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    emailAlreadyInUseResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    badRequest,
    ok,
    serverError,
} from '../helpers/index.js';

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const updateParams = httpRequest.body;
            const userId = httpRequest.params.userId;

            const isIdValid = checkIfIdIsValid(userId);
            if (!isIdValid) return invalidIdResponse();

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
                (field) => !allowedFields.includes(field) // <-- CORRIGIDO!
            );
            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                });
            }

            if (updateParams.password) {
                const passwordIsValid = checkIfPasswordIsValid(
                    updateParams.password
                );
                if (!passwordIsValid) return invalidPasswordResponse();
            }

            if (updateParams.email) {
                const emailIsValid = checkIfEmailIsValid(updateParams.email);
                if (!emailIsValid) return emailAlreadyInUseResponse();
            }

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                updateParams
            );

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}
