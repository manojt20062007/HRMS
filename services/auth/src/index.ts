import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from '@hrms/logger';
import { errorHandler } from '@hrms/common';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

import { authRouter } from './routes/auth';

app.get('/api/auth/health', (req, res) => {
  res.send({ status: 'ok', service: 'auth' });
});

app.use('/api/auth', authRouter);

app.use(errorHandler);

const start = async () => {
  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    logger.info(`Auth service listening on port ${PORT}`);
  });
};

start();
