import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// Get all assets
router.get('/', async (req: any, res: any) => {
  try {
    const assets = await getPrisma(req).asset.findMany({
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Create asset
router.post('/', async (req: any, res: any) => {
  try {
    const { assetName, assetType, serialNumber, status } = req.body;
    
    const asset = await getPrisma(req).asset.create({
      data: {
        assetName,
        assetType,
        serialNumber,
        status: status || 'AVAILABLE'
      }
    });
    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// Update asset
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { assetName, assetType, serialNumber, status } = req.body;
    
    const asset = await getPrisma(req).asset.update({
      where: { id },
      data: {
        assetName,
        assetType,
        serialNumber,
        status
      }
    });
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

// Delete asset
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await getPrisma(req).asset.delete({ where: { id } });
    res.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Assign asset to employee
router.put('/:id/assign', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;
    
    const asset = await getPrisma(req).asset.update({
      where: { id },
      data: {
        assignedToId: employeeId,
        assignedDate: new Date(),
        status: 'ASSIGNED'
      },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } }
      }
    });
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to assign asset' });
  }
});

// Unassign asset
router.put('/:id/unassign', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const asset = await getPrisma(req).asset.update({
      where: { id },
      data: {
        assignedToId: null,
        assignedDate: null,
        status: 'AVAILABLE'
      }
    });
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unassign asset' });
  }
});

export default router;
