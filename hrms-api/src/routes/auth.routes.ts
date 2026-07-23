import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-hrms-key';

// Login Route
router.post('/login', async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required' });
    }

    let user: any = null;
    let employeeProfile: any = null;

    // Check if input is an email or mobile number
    if (phone.includes('@')) {
      user = await prisma.user.findUnique({
        where: { email: phone },
        include: {
          role: {
            include: { permissions: true }
          },
          employee: true
        }
      });
      employeeProfile = user?.employee;
    } else {
      const employee = await prisma.employee.findFirst({
        where: { mobileNumber: phone },
        include: {
          user: {
            include: {
              role: {
                include: { permissions: true }
              }
            }
          }
        }
      });
      user = employee?.user;
      employeeProfile = employee;
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role.name,
        isSuperAdmin: user.role.name === 'SUPER_ADMIN'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response and structure it to include employee details
    const { password: _, ...userWithoutPassword } = user;
    const responseUser = {
      ...userWithoutPassword,
      employee: employeeProfile ? {
        id: employeeProfile.id,
        firstName: employeeProfile.firstName,
        lastName: employeeProfile.lastName,
        reportingToId: employeeProfile.reportingToId
      } : null
    };

    res.json({
      message: 'Login successful',
      token,
      user: responseUser
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
