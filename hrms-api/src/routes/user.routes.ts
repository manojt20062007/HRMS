import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Middleware to check if user is Super Admin
const requireSuperAdmin = (req: any, res: any, next: any) => {
  // In a real app, this would verify the JWT and check req.user.isSuperAdmin
  next();
};

// Create a new User (Secure Signup Process)
router.post('/', requireSuperAdmin, async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { email, password, roleId } = req.body;

    if (!email || !password || !roleId) {
      return res.status(400).json({ error: 'Email, password, and roleId are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId,
      },
      include: {
        role: true
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
