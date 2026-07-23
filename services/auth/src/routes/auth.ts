import express from 'express';
import { prisma } from '@hrms/database';
import { BadRequestError } from '@hrms/common';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, tenantId } = req.body;

  // Verify tenant exists
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    throw new BadRequestError('Invalid Tenant ID');
  }

  // Use tenant-specific connection (in a real app, this would use getTenantPrisma(tenant.schema))
  // But for the shared User table design above, it's in public for now. 
  // Wait, the User model has tenantId, so it is in the public schema right now according to my schema.prisma.
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new BadRequestError('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      tenantId,
    },
  });

  const userJwt = jwt.sign(
    { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role },
    process.env.JWT_KEY || 'secret',
    { expiresIn: '1h' }
  );

  res.status(201).send({ user, token: userJwt });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials');
  }

  const userJwt = jwt.sign(
    { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role },
    process.env.JWT_KEY || 'secret',
    { expiresIn: '1h' }
  );

  res.status(200).send({ user, token: userJwt });
});

export { router as authRouter };
