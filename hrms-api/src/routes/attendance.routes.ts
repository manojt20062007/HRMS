import express from 'express';

const router = express.Router();

const getPrisma = (req: any) => req.prisma;

// ==========================================
// 1. Daily Attendance (Check In/Out)
// ==========================================
router.get('/', async (req: any, res: any) => {
  try {
    // Optionally filter by date
    const { date } = req.query;
    let whereClause = {};
    if (date) {
      const targetDate = new Date(date as string);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      whereClause = {
        date: { gte: targetDate, lt: nextDate }
      };
    }

    const records = await getPrisma(req).attendanceRecord.findMany({
      where: whereClause,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Mark Attendance (Check-in or Check-out)
router.post('/mark', async (req: any, res: any) => {
  try {
    const { employeeId, type, status } = req.body; // type: 'CHECK_IN' or 'CHECK_OUT'
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await getPrisma(req).attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId: employeeId,
          date: today
        }
      }
    });

    if (type === 'CHECK_IN') {
      if (existingRecord) {
        return res.status(400).json({ error: 'Already checked in today' });
      }
      const newRecord = await getPrisma(req).attendanceRecord.create({
        data: {
          employeeId,
          date: today,
          checkIn: new Date(),
          status: status || 'PRESENT'
        }
      });
      return res.status(201).json(newRecord);
    } else if (type === 'CHECK_OUT') {
      if (!existingRecord) {
        return res.status(400).json({ error: 'No check-in record found for today' });
      }
      const updatedRecord = await getPrisma(req).attendanceRecord.update({
        where: { id: existingRecord.id },
        data: { checkOut: new Date() }
      });
      return res.json(updatedRecord);
    }
    
    res.status(400).json({ error: 'Invalid type' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// ==========================================
// 2. Holidays
// ==========================================
router.get('/holidays', async (req: any, res: any) => {
  try {
    const holidays = await getPrisma(req).holiday.findMany({
      orderBy: { date: 'asc' }
    });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
});

router.post('/holidays', async (req: any, res: any) => {
  try {
    const { name, date, type } = req.body;
    const holiday = await getPrisma(req).holiday.create({
      data: { name, date: new Date(date), type }
    });
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create holiday' });
  }
});

export default router;
