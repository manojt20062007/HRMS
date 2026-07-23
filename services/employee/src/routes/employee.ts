import express from 'express';
import { prisma } from '@hrms/database';
import { BadRequestError } from '@hrms/common';

const router = express.Router();

router.get('/', async (req, res) => {
  // In a real implementation, we would extract tenantId from the JWT token middleware
  // For now, we fetch all from the shared schema just to demonstrate connectivity.
  const employees = await prisma.employee.findMany();
  res.send(employees);
});

router.post('/', async (req, res) => {
  const { employeeId, firstName, lastName, email, tenantId } = req.body;

  if (!tenantId) {
    throw new BadRequestError('Tenant ID is required');
  }

  const existing = await prisma.employee.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError('Employee with this email already exists');
  }

  const employee = await prisma.employee.create({
    data: {
      employeeId,
      firstName,
      lastName,
      email,
      tenantId
    }
  });

  res.status(201).send(employee);
});

export { router as employeeRouter };
