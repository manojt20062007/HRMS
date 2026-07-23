import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// 1. Get all resignation requests (optionally filter by status for L1/L2 views)
router.get('/', async (req: any, res: any) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    if (status) {
      whereClause = { status: status as string };
    }

    const requests = await getPrisma(req).resignationRequest.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resignation requests' });
  }
});

// 2. Submit a new resignation request
router.post('/', async (req: any, res: any) => {
  try {
    const { employeeId, resignationDate, lastWorkingDay, reason } = req.body;
    
    const request = await getPrisma(req).resignationRequest.create({
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
    const { status } = req.body; // e.g., 'PENDING_L2', 'APPROVED', 'REJECTED'
    
    const request = await getPrisma(req).resignationRequest.update({
      where: { id },
      data: { status }
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resignation status' });
  }
});

export default router;
