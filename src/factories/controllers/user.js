import {
    PostgresGetUserByIdRepository,
    PostgresGetUserByEmailRepository,
    PostgresCreateUserRepository,
    PostgresUpdateUserRepository,
    PostgresDeleteUserRepository,
} from '../../repositories/postgres/index.js';
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
} from '../../use-cases/index.js';
import {
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
} from '../../controllers/index.js';

export const makeGetUserByIdController = () => {
    const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(
        postgresGetUserByIdRepository
    );
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    return getUserByIdController;
};

export const makeCreateUserController = () => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createUserUseCase = new CreateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository
    );
    const createUserController = new CreateUserController(createUserUseCase);

    return createUserController;
};

export const makeUpdateUserController = () => {
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
    const updateUserUseCase = new UpdateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository
    );
    const updateUserController = new UpdateUserController(updateUserUseCase);
    return updateUserController;
};

export const makeDeleteUserController = () => {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(
        postgresDeleteUserRepository
    );
    const deleteUserController = new DeleteUserController(deleteUserUseCase);
    return deleteUserController;
};
