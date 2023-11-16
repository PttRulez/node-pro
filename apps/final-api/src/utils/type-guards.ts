import { HTTPError } from 'src/errors/http-error.class';

export const isHttpError = (value: any): boolean => {
	return value instanceof HTTPError;
};
