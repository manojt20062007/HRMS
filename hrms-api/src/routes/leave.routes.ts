import express from 'express';

const router = express.Router();

const getPrisma = (req: any) => req.prisma;

// 1. Get leave requests (filtered by managerId, requesterId, or returns all if none provided)
router.get('/', async (req: any, res: any) => {
  try {
    const prisma = getPrisma(req);
    const { managerId, requesterId } = req.query;
    console.log('[Leave API] GET / leaves. query:', { managerId, requesterId });

    let whereClause: any = {};
    let filter: any = {};
    if (requesterId) {
      filter = {
        OR: [
          { employeeId: String(requesterId) },
          { employee: { reportingToId: String(requesterId) } }
        ]
      };
    } else if (managerId && managerId !== 'undefined' && managerId !== 'null') {
      filter = {
        employee: {
          reportingToId: managerId
        }
      };
    }
    console.log('[Leave API] constructed filter:', JSON.stringify(filter));

    const leaves = await prisma.leaveRequest.findMany({
      where: filter,
      include: {
        employee: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            employeeIdString: true,
            user: {
              include: { roles: true }
            }
          } 
        },
        approvedBy: { select: { id: true, firstName: true, lastName: true } }
      }
    });
    res.json(leaves);
  } catch (error) {
    console.error('Failed to fetch leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// 2. Apply for a leave
router.post('/', async (req: any, res: any) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    
    const leave = await getPrisma(req).leaveRequest.create({
      data: {
        employeeId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      }
    });
    res.status(201).json(leave);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

// 3. Approve/Reject Leave
router.put('/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, approvedById } = req.body; // status should be 'APPROVED' or 'REJECTED'
    
    const leave = await getPrisma(req).leaveRequest.update({
      where: { id },
      data: { status, approvedById }
    });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave status' });
  }
});

// 4. Delete Leave Request
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).leaveRequest.delete({ where: { id } });
    res.json({ message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete leave request' });
  }
});

export default router;
