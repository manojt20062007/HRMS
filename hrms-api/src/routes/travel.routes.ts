import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// 1. Get all travel expenses (optionally filter by status for L1/L2 views)
router.get('/', async (req: any, res: any) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    if (status) {
      whereClause = { status: status as string };
    }

    const expenses = await getPrisma(req).travelExpense.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch travel expenses' });
  }
});

// 2. Submit a new travel expense
router.post('/', async (req: any, res: any) => {
  try {
    const { employeeId, date, amount, description } = req.body;
    
    const expense = await getPrisma(req).travelExpense.create({
      data: {
        employeeId,
        date: new Date(date),
        amount: parseFloat(amount),
        description,
        status: 'PENDING_L1' // Initial status
      }
    });
    res.status(201).json(expense);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create travel expense' });
  }
});

// 3. Update expense status (for L1 and L2 approvals)
router.put('/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'PENDING_L2', 'APPROVED', 'REJECTED'
    
    const expense = await getPrisma(req).travelExpense.update({
      where: { id },
      data: { status }
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update travel expense status' });
  }
});

export default router;
