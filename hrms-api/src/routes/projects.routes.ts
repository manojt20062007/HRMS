import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// Get all projects
router.get('/', async (req: any, res: any) => {
  try {
    const projects = await getPrisma(req).project.findMany({
      include: {
        employees: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
router.post('/', async (req: any, res: any) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    
    // Use the exact date if provided, otherwise null
    const projectStartDate = startDate ? new Date(startDate) : new Date();
    const projectEndDate = endDate ? new Date(endDate) : null;

    const project = await getPrisma(req).project.create({
      data: {
        name,
        description,
        startDate: projectStartDate,
        endDate: projectEndDate,
        status: status || 'ACTIVE'
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status } = req.body;
    
    const project = await getPrisma(req).project.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status
      }
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).project.delete({ where: { id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Assign employee to project
router.post('/:id/employees', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { employeeId, role } = req.body;
    
    const assignment = await getPrisma(req).employeeProject.create({
      data: {
        projectId: id,
        employeeId,
        role
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to assign employee' });
  }
});

// Remove employee from project
router.delete('/:id/employees/:employeeId', async (req: any, res: any) => {
  try {
    const { id, employeeId } = req.params;
    
    await getPrisma(req).employeeProject.delete({
      where: {
        employeeId_projectId: {
          employeeId,
          projectId: id
        }
      }
    });
    res.json({ message: 'Employee removed from project' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove employee' });
  }
});

export default router;
