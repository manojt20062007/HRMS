import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// 1. Get all resignation requests (optionally filter by status or employeeId)
router.get('/', async (req: any, res: any) => {
  try {
    const { status, employeeId, managerId } = req.query;
    let whereClause: any = {};
    if (status) whereClause.status = status as string;
    if (employeeId) whereClause.employeeId = employeeId;
    if (managerId) whereClause.employee = { reportingToId: managerId };

    const requests = await getPrisma(req).resignation.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true, designation: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch resignation requests' });
  }
});

// 2. Submit a new resignation request
router.post('/', async (req: any, res: any) => {
  try {
    const { employeeId, resignationDate, lastWorkingDay, reason } = req.body;
    
    const request = await getPrisma(req).resignation.create({
      data: {
        employeeId,
        resignationDate: new Date(resignationDate),
        lastWorkingDay: new Date(lastWorkingDay),
        reason,
        status: 'PENDING_L1' // Initial status
      }
    });
    res.status(201).json(request);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create resignation request' });
  }
});

// 3. Update resignation status (for L1 and L2 approvals)
router.put('/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, managerComments, hrComments } = req.body; // e.g., 'PENDING_L2', 'APPROVED', 'REJECTED'
    
    const updateData: any = { status };
    if (managerComments !== undefined) updateData.managerComments = managerComments;
    if (hrComments !== undefined) updateData.hrComments = hrComments;

    const request = await getPrisma(req).resignation.update({
      where: { id },
      data: updateData
    });
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update resignation status' });
  }
});

export default router;
