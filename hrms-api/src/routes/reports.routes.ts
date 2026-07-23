import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// Attendance Report
router.get('/attendance', async (req: any, res: any) => {
  try {
    const records = await getPrisma(req).attendanceRecord.findMany({
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true, department: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Attendance Route Error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance report' });
  }
});

// Designation History Report (Simplified to current designation)
router.get('/designation-history', async (req: any, res: any) => {
  try {
    const employees = await getPrisma(req).employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeIdString: true,
        designation: true,
        department: true,
        joiningDate: true
      },
      orderBy: { firstName: 'asc' }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designation history' });
  }
});

// Leave Balance Report
router.get('/leave-balance', async (req: any, res: any) => {
  try {
    const employees = await getPrisma(req).employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeIdString: true,
        leaveRequests: {
          where: { status: 'APPROVED' }
        }
      }
    });
    
    // Calculate taken leaves
    const report = employees.map((emp: any) => {
      const taken = emp.leaveRequests.reduce((acc: number, req: any) => acc + (req.totalDays || 0), 0);
      return {
        ...emp,
        totalLeaves: 24, // Assuming 24 total leaves a year
        takenLeaves: taken,
        balanceLeaves: 24 - taken
      };
    });
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave balance report' });
  }
});

// Leave Report
router.get('/leaves', async (req: any, res: any) => {
  try {
    const leaves = await getPrisma(req).leaveRequest.findMany({
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true, department: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave report' });
  }
});

// Permission Report (Roles)
router.get('/permissions', async (req: any, res: any) => {
  try {
    const users = await getPrisma(req).user.findMany({
      include: {
        employee: { select: { firstName: true, lastName: true, employeeIdString: true, department: true } }
      },
      orderBy: { email: 'asc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permission report' });
  }
});

export default router;
