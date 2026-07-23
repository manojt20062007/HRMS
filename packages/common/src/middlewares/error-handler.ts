import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-errors';
import { logger } from '@hrms/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  logger.error(err);

  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
