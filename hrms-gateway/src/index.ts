import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from '@hrms/logger';

const app = express();

app.use(helmet());
app.use(cors());

// Proxy configuration
// /api/auth -> Auth Service
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:4001', 
  changeOrigin: true 
}));

// /api/tenant -> Tenant Service
app.use('/api/tenant', createProxyMiddleware({ 
  target: process.env.TENANT_SERVICE_URL || 'http://localhost:4002', 
  changeOrigin: true 
}));

// /api/employee -> Employee Service
app.use('/api/employee', createProxyMiddleware({ 
  target: process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:4003', 
  changeOrigin: true 
}));

app.get('/health', (req, res) => {
  res.send({ status: 'ok', service: 'gateway' });
});

const start = () => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    logger.info(`API Gateway listening on port ${PORT}`);
  });
};

start();
