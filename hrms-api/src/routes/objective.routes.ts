import express from 'express';

const router = express.Router();

const getPrisma = (req: any) => req.prisma;

// GET /api/objectives
// Fetch objectives filtered by employeeId, managerId, and status
router.get('/', async (req: any, res: any) => {
  try {
    const { employeeId, managerId, status } = req.query;
    let whereClause: any = {};

    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    if (managerId) {
      whereClause.employee = { reportingToId: managerId };
    }

    if (status) {
      whereClause.status = status;
    }

    const records = await getPrisma(req).objective.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Failed to fetch objectives:', error);
    res.status(500).json({ error: 'Failed to fetch objectives' });
  }
});

// POST /api/objectives
// Create a new objective
router.post('/', async (req: any, res: any) => {
  try {
    const { employeeId, title, weightage, deadline } = req.body;
    if (!employeeId || !title || weightage === undefined || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const targetDate = new Date(deadline);

    const newRecord = await getPrisma(req).objective.create({
      data: {
        employeeId,
        title,
        weightage: parseFloat(weightage),
        deadline: targetDate,
        status: 'DRAFT'
      }
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Failed to create objective:', error);
    res.status(500).json({ error: 'Failed to create objective' });
  }
});

// PUT /api/objectives/employee/:employeeId
// Batch update all submitted objectives for an employee (Manager Approval)
router.put('/employee/:employeeId', async (req: any, res: any) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;
    
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = await getPrisma(req).objective.updateMany({
      where: { 
        employeeId: employeeId,
        status: 'SUBMITTED' // Only update ones that were submitted
      },
      data: { status }
    });

    res.json({ message: 'Objectives updated successfully', count: updated.count });
  } catch (error) {
    console.error('Failed to batch update objectives:', error);
    res.status(500).json({ error: 'Failed to batch update objectives' });
  }
});

// PUT /api/objectives/:id
// Update an existing objective
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, weightage, deadline, status } = req.body;
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (weightage !== undefined) updateData.weightage = parseFloat(weightage);
    if (deadline !== undefined) updateData.deadline = new Date(deadline);
    if (status !== undefined) updateData.status = status;

    const updatedRecord = await getPrisma(req).objective.update({
      where: { id },
      data: updateData
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error('Failed to update objective:', error);
    res.status(500).json({ error: 'Failed to update objective' });
  }
});

// DELETE /api/objectives/:id
// Delete an objective
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).objective.delete({
      where: { id }
    });
    res.json({ message: 'Objective deleted successfully' });
  } catch (error) {
    console.error('Failed to delete objective:', error);
    res.status(500).json({ error: 'Failed to delete objective' });
  }
});

export default router;
