import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// ------------------------------------------
// APPRAISAL CYCLES
// ------------------------------------------

// GET /api/appraisals/cycles
router.get('/cycles', async (req: any, res: any) => {
  try {
    const cycles = await getPrisma(req).appraisalCycle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(cycles);
  } catch (error) {
    console.error('Failed to fetch cycles:', error);
    res.status(500).json({ error: 'Failed to fetch cycles' });
  }
});

// POST /api/appraisals/cycles
router.post('/cycles', async (req: any, res: any) => {
  try {
    const { name, startDate, endDate } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCycle = await getPrisma(req).appraisalCycle.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
        stage: 'SELF_REVIEW'
      }
    });

    res.status(201).json(newCycle);
  } catch (error) {
    console.error('Failed to create cycle:', error);
    res.status(500).json({ error: 'Failed to create cycle' });
  }
});

// PUT /api/appraisals/cycles/:id
router.put('/cycles/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, stage } = req.body;
    
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (stage !== undefined) updateData.stage = stage;

    const updated = await getPrisma(req).appraisalCycle.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to update cycle:', error);
    res.status(500).json({ error: 'Failed to update cycle' });
  }
});

// ------------------------------------------
// APPRAISALS (INDIVIDUAL)
// ------------------------------------------

// GET /api/appraisals
// Query params: employeeId, managerId, status
router.get('/', async (req: any, res: any) => {
  try {
    const { employeeId, managerId, status } = req.query;
    let whereClause: any = {};

    if (employeeId) whereClause.employeeId = employeeId;
    if (managerId) whereClause.employee = { reportingToId: managerId };
    if (status) whereClause.status = status;

    const appraisals = await getPrisma(req).appraisal.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true, designation: true } },
        cycle: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(appraisals);
  } catch (error) {
    console.error('Failed to fetch appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

// POST /api/appraisals
// Submit self-review
router.post('/', async (req: any, res: any) => {
  try {
    const { cycleId, employeeId, selfRating, selfComments } = req.body;
    
    if (!cycleId || !employeeId || !selfRating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAppraisal = await getPrisma(req).appraisal.create({
      data: {
        cycleId,
        employeeId,
        selfRating: parseInt(selfRating),
        selfComments,
        status: 'PENDING_MANAGER'
      }
    });

    res.status(201).json(newAppraisal);
  } catch (error) {
    console.error('Failed to create appraisal:', error);
    res.status(500).json({ error: 'Failed to create appraisal (might already exist)' });
  }
});

// PUT /api/appraisals/:id
// Update manager/hr reviews
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { managerRating, managerComments, hrRating, hrComments, status } = req.body;
    
    const updateData: any = {};
    if (managerRating !== undefined) updateData.managerRating = parseInt(managerRating);
    if (managerComments !== undefined) updateData.managerComments = managerComments;
    if (hrRating !== undefined) updateData.hrRating = parseInt(hrRating);
    if (hrComments !== undefined) updateData.hrComments = hrComments;
    if (status !== undefined) updateData.status = status;

    const updated = await getPrisma(req).appraisal.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to update appraisal:', error);
    res.status(500).json({ error: 'Failed to update appraisal' });
  }
});

export default router;
