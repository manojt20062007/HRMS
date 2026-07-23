import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// ==========================================
// SALARY COMPONENTS
// ==========================================

router.get('/salary-components/:employeeId', async (req: any, res: any) => {
  try {
    const { employeeId } = req.params;
    let component = await getPrisma(req).salaryComponent.findUnique({
      where: { employeeId }
    });

    // If no component exists, create a default one
    if (!component) {
      component = await getPrisma(req).salaryComponent.create({
        data: {
          employeeId,
          basicPay: 0,
          hra: 0,
          da: 0,
          pf: 0,
          taxes: 0
        }
      });
    }

    res.json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch salary component' });
  }
});

router.put('/salary-components/:employeeId', async (req: any, res: any) => {
  try {
    const { employeeId } = req.params;
    const { basicPay, hra, da, pf, taxes } = req.body;
    
    const component = await getPrisma(req).salaryComponent.upsert({
      where: { employeeId },
      update: { basicPay, hra, da, pf, taxes },
      create: { employeeId, basicPay, hra, da, pf, taxes }
    });
    
    res.json(component);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update salary component' });
  }
});

// ==========================================
// PAYROLL RECORDS
// ==========================================

router.get('/records', async (req: any, res: any) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const records = await getPrisma(req).payrollRecord.findMany({
      where: {
        month: parseInt(month as string, 10),
        year: parseInt(year as string, 10)
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeIdString: true, department: true, designation: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll records' });
  }
});

router.post('/generate', async (req: any, res: any) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const prisma = getPrisma(req);

    // Fetch all active employees with their salary components
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: { salaryComponent: true }
    });

    const records = [];

    // Process payroll for each
    for (const emp of employees) {
      const comp = emp.salaryComponent || { basicPay: 0, hra: 0, da: 0, pf: 0, taxes: 0 };
      const netPay = comp.basicPay + comp.hra + comp.da - comp.pf - comp.taxes;

      const record = await prisma.payrollRecord.upsert({
        where: {
          employeeId_month_year: {
            employeeId: emp.id,
            month,
            year
          }
        },
        update: {
          basicPay: comp.basicPay,
          hra: comp.hra,
          da: comp.da,
          pf: comp.pf,
          taxes: comp.taxes,
          netPay,
          status: 'DRAFT'
        },
        create: {
          employeeId: emp.id,
          month,
          year,
          basicPay: comp.basicPay,
          hra: comp.hra,
          da: comp.da,
          pf: comp.pf,
          taxes: comp.taxes,
          netPay,
          status: 'DRAFT'
        }
      });
      records.push(record);
    }

    res.json({ message: 'Payroll generated successfully', count: records.length });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate payroll' });
  }
});

router.put('/records/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // DRAFT, PROCESSED, PAID
    
    const record = await getPrisma(req).payrollRecord.update({
      where: { id },
      data: { status }
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payroll status' });
  }
});

export default router;
