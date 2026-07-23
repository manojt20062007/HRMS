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

import { tenantRouter } from './routes/tenant';

app.get('/api/tenant/health', (req, res) => {
  res.send({ status: 'ok', service: 'tenant' });
});

app.use('/api/tenant', tenantRouter);

app.use(errorHandler);

const start = async () => {
  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    logger.info(`Tenant service listening on port ${PORT}`);
  });
};

start();
