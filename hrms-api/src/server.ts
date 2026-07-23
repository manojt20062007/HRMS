import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import roleRoutes from './routes/role.routes';
import userRoutes from './routes/user.routes';
import employeeRoutes from './routes/employee.routes';
import systemRoutes from './routes/system.routes';
import settingsRoutes from './routes/settings.routes';
import leaveRoutes from './routes/leave.routes';
import attendanceRoutes from './routes/attendance.routes';
import travelRoutes from './routes/travel.routes';
import resignationRoutes from './routes/resignation.routes';
import recruitmentRoutes from './routes/recruitment.routes';
import payrollRoutes from './routes/payroll.routes';
import projectsRoutes from './routes/projects.routes';
import assetsRoutes from './routes/assets.routes';
import reportsRoutes from './routes/reports.routes';
import { tenantMiddleware } from './middlewares/tenant.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'Accept']
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HRMS API is running' });
});

// System Routes (No Tenant Middleware needed)
app.use('/api/system', systemRoutes);

// Tenant API Routes (Requires x-tenant-id header)
app.use('/api/auth', tenantMiddleware, authRoutes);
app.use('/api/roles', tenantMiddleware, roleRoutes);
app.use('/api/users', tenantMiddleware, userRoutes);
app.use('/api/employees', tenantMiddleware, employeeRoutes);
app.use('/api/settings', tenantMiddleware, settingsRoutes);
app.use('/api/leave', tenantMiddleware, leaveRoutes);
app.use('/api/attendance', tenantMiddleware, attendanceRoutes);
app.use('/api/travel', tenantMiddleware, travelRoutes);
app.use('/api/resignation', tenantMiddleware, resignationRoutes);
app.use('/api/recruitment', tenantMiddleware, recruitmentRoutes);
app.use('/api/payroll', tenantMiddleware, payrollRoutes);
app.use('/api/projects', tenantMiddleware, projectsRoutes);
app.use('/api/assets', tenantMiddleware, assetsRoutes);
app.use('/api/reports', tenantMiddleware, reportsRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
