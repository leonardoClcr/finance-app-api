import { CreateUserUseCase } from '../use-cases/create-user-use-case.js';
import validator from 'validator';
import { badRequest, created, serverError } from './helpers.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;
            // validar a requisição (campos e tamanho de senha)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `Missing param: ${field}`,
                    });
                }
            }

            // validar tamanho senha
            const passwordIsValid = params.password.length < 6;
            if (passwordIsValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters.',
                });
            }

            // validar o email
            const emailIsValid = validator.isEmail(params.email);
            if (!emailIsValid) {
                return badRequest({
                    message: 'Invalid e-mail. Please provide a valid one.',
                });
            }

            // chamar o use case
            const createUserUseCase = new CreateUserUseCase();
            const createdUser = await createUserUseCase.execute(params);
            // retornar a resposta ao usuario (status code 201)
            return created(createdUser);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError({
                message: 'Internal Server error.',
            });
        }
    }
}
