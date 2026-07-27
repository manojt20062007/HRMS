import express from 'express';

const router = express.Router();

const getPrisma = (req: any) => req.prisma;

// GET /api/worklog
// Fetch worklogs with optional filtering by employeeId, managerId, status, and month
router.get('/', async (req: any, res: any) => {
  try {
    const { employeeId, managerId, status, month } = req.query;
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

    if (month) {
      // month is YYYY-MM
      const [year, m] = (month as string).split('-');
      const startDate = new Date(parseInt(year), parseInt(m) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(m), 1);
      whereClause.date = { gte: startDate, lt: endDate };
    }

    const records = await getPrisma(req).worklog.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Failed to fetch worklogs:', error);
    res.status(500).json({ error: 'Failed to fetch worklogs' });
  }
});

// POST /api/worklog
// Create a new worklog entry
router.post('/', async (req: any, res: any) => {
  try {
    const { employeeId, date, hours, description } = req.body;
    if (!employeeId || !date || !hours || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const newRecord = await getPrisma(req).worklog.create({
      data: {
        employeeId,
        date: targetDate,
        hours: parseFloat(hours),
        description,
        status: 'PENDING_L1'
      },
      include: {
        employee: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Failed to create worklog:', error);
    res.status(500).json({ error: 'Failed to create worklog' });
  }
});

// PUT /api/worklog/:id
// Update an existing worklog entry
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { hours, description, status } = req.body;
    
    const updateData: any = {};
    if (hours !== undefined) updateData.hours = parseFloat(hours);
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const updatedRecord = await getPrisma(req).worklog.update({
      where: { id },
      data: updateData
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error('Failed to update worklog:', error);
    res.status(500).json({ error: 'Failed to update worklog' });
  }
});

// DELETE /api/worklog/:id
// Delete a worklog entry
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).worklog.delete({
      where: { id }
    });
    res.json({ message: 'Worklog deleted successfully' });
  } catch (error) {
    console.error('Failed to delete worklog:', error);
    res.status(500).json({ error: 'Failed to delete worklog' });
  }
});

export default router;
