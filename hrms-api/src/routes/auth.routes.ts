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

    // Find employee by mobileNumber
    const employee = await prisma.employee.findFirst({
      where: {
        mobileNumber: phone
      },
      include: {
        user: {
          include: {
            role: {
              include: {
                permissions: true,
              }
            }
          }
        }
      }
    });

    if (!employee || !employee.user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = employee.user;

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
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        reportingToId: employee.reportingToId
      }
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
