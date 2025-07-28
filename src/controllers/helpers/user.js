import { badRequest, notFound } from '../helpers/index.js';
import validator from 'validator';

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters.',
    });
};

export const emailAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Invalid e-mail. Please provide a valid one.',
    });
};

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided ID is not valid.',
    });
};

export const checkIfPasswordIsValid = (password) => {
    return password.length >= 6;
};

export const checkIfEmailIsValid = (email) => {
    return validator.isEmail(email);
};

export const checkIfIdIsValid = (id) => {
    return validator.isUUID(id);
};

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found.',
    });
};
