import 'dotenv/config.js';
import express from 'express';
import {
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
} from './src/controllers/index.js';
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from './src/repositories/postgres/index.js';
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from './src/use-cases/index.js';

const app = express();

app.use(express.json());

app.post('/api/users', async (req, res) => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createUserUseCase = new CreateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository
    );
    const createUserController = new CreateUserController(createUserUseCase);

    const { statusCode, body } = await createUserController.execute(req);

    res.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (req, res) => {
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
    const updateUserUseCase = new UpdateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository
    );
    const updateUserController = new UpdateUserController(updateUserUseCase);

    const { statusCode, body } = await updateUserController.execute(req);

    res.status(statusCode).send(body);
});

app.get('/api/users/:userId', async (req, res) => {
    const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(
        postgresGetUserByIdRepository
    );
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    const { statusCode, body } = await getUserByIdController.execute(req);

    res.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (req, res) => {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(
        postgresDeleteUserRepository
    );
    const deleteUserController = new DeleteUserController(deleteUserUseCase);

    const { statusCode, body } = await deleteUserController.execute(req);
    res.status(statusCode).send(body);
});

app.listen(process.env.PORT, () => {
    console.log('listening on port 8080.');
});
