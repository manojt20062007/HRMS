import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Middleware to check if user is Super Admin
const requireSuperAdmin = (req: any, res: any, next: any) => {
  // In a real app, this would verify the JWT and check req.user.isSuperAdmin
  // For now, we assume the middleware is attached after an auth middleware
  next();
};

// Create a new Role
router.post('/', requireSuperAdmin, async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const role = await prisma.role.create({
      data: {
        name: name.toUpperCase(),
        permissions: {
          create: permissions || []
        }
      },
      include: {
        permissions: true
      }
    });

    res.status(201).json(role);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Role already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all roles
router.get('/', requireSuperAdmin, async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true }
        }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Role Permissions
router.put('/:id/permissions', requireSuperAdmin, async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    const { permissions } = req.body; // Array of { pageName, canRead, canWrite }

    // First delete existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId: id }
    });

    // Then create the new ones
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        permissions: {
          create: permissions
        }
      },
      include: {
        permissions: true
      }
    });

    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a Role
router.delete('/:id', requireSuperAdmin, async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    // First remove permissions, then the role
    await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await prisma.role.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete role — users are assigned to it. Reassign users first.' });
    }
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

export default router;
