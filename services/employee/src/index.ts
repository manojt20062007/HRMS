import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from '@hrms/logger';
import { errorHandler } from '@hrms/common';
import { employeeRouter } from './routes/employee';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/employee/health', (req, res) => {
  res.send({ status: 'ok', service: 'employee' });
});

app.use('/api/employee', employeeRouter);

app.use(errorHandler);

const start = async () => {
  const PORT = process.env.PORT || 4003;
  app.listen(PORT, () => {
    logger.info(`Employee service listening on port ${PORT}`);
  });
};

start();
