import express from 'express';

const router = express.Router();

// Helper to get prisma from req
const getPrisma = (req: any) => req.prisma;

// ==========================================
// 1. Department Routes
// ==========================================
router.get('/departments', async (req: any, res: any) => {
  try {
    const departments = await getPrisma(req).department.findMany();
    // In a real app you might also count employees in this department
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.post('/departments', async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    const dept = await getPrisma(req).department.create({
      data: { name, description }
    });
    res.status(201).json(dept);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Department already exists' });
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.put('/departments/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const dept = await getPrisma(req).department.update({
      where: { id },
      data: { name, description }
    });
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/departments/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).department.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// ==========================================
// 2. Designation Routes
// ==========================================
router.get('/designations', async (req: any, res: any) => {
  try {
    const designations = await getPrisma(req).designation.findMany();
    res.json(designations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
});

router.post('/designations', async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    const desig = await getPrisma(req).designation.create({
      data: { name, description }
    });
    res.status(201).json(desig);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Designation already exists' });
    res.status(500).json({ error: 'Failed to create designation' });
  }
});

router.put('/designations/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const desig = await getPrisma(req).designation.update({
      where: { id },
      data: { name, description }
    });
    res.json(desig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update designation' });
  }
});

router.delete('/designations/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).designation.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete designation' });
  }
});

// ==========================================
// 3. Client Routes
// ==========================================
router.get('/clients', async (req: any, res: any) => {
  try {
    const clients = await getPrisma(req).client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post('/clients', async (req: any, res: any) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const client = await getPrisma(req).client.create({
      data: { name, contactPerson, email, phone, address }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// ==========================================
// 4. Domain Routes
// ==========================================
router.get('/domains', async (req: any, res: any) => {
  try {
    const domains = await getPrisma(req).domainMaster.findMany();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

router.post('/domains', async (req: any, res: any) => {
  try {
    const { name, status } = req.body;
    const domain = await getPrisma(req).domainMaster.create({
      data: { name, status }
    });
    res.status(201).json(domain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create domain' });
  }
});

// ==========================================
// 5. Employee Visit Type Routes
// ==========================================
router.get('/visits', async (req: any, res: any) => {
  try {
    const visits = await getPrisma(req).employeeVisitType.findMany();
    res.json(visits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

router.post('/visits', async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    const visit = await getPrisma(req).employeeVisitType.create({
      data: { name, description }
    });
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

// ==========================================
// 6. Leave Time Settings Routes
// ==========================================
router.get('/leave-settings', async (req: any, res: any) => {
  try {
    const settings = await getPrisma(req).leaveTimeSetting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave settings' });
  }
});

router.post('/leave-settings', async (req: any, res: any) => {
  try {
    const { leaveName, totalLeave, isCarryForward, type } = req.body;
    const setting = await getPrisma(req).leaveTimeSetting.create({
      data: { leaveName, totalLeave: parseInt(totalLeave), isCarryForward, type }
    });
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave setting' });
  }
});

// ==========================================
// 7. Payroll Settings Routes
// ==========================================
router.get('/payroll-settings', async (req: any, res: any) => {
  try {
    const settings = await getPrisma(req).payrollSetting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll settings' });
  }
});

router.post('/payroll-settings', async (req: any, res: any) => {
  try {
    const { category, value } = req.body;
    const setting = await getPrisma(req).payrollSetting.create({
      data: { category, value: parseFloat(value) }
    });
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payroll setting' });
  }
});

export default router;
