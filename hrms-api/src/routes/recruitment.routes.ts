import express from 'express';

const router = express.Router();
const getPrisma = (req: any) => req.prisma;

// ==========================================
// STAFFING REQUESTS
// ==========================================

router.get('/staffing', async (req: any, res: any) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    if (status) {
      whereClause = { status: status as string };
    }

    const requests = await getPrisma(req).staffingRequest.findMany({
      where: whereClause,
      include: {
        requestedBy: { select: { id: true, firstName: true, lastName: true, employeeIdString: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staffing requests' });
  }
});

router.post('/staffing', async (req: any, res: any) => {
  try {
    const { department, designation, positions, experience, budget, justification, requestedById } = req.body;
    
    const request = await getPrisma(req).staffingRequest.create({
      data: {
        department,
        designation,
        positions: parseInt(positions, 10),
        experience,
        budget: parseFloat(budget),
        justification,
        requestedById,
        status: 'PENDING_RM' // Initial status
      }
    });
    res.status(201).json(request);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create staffing request' });
  }
});

router.put('/staffing/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING_HR, PENDING_CTO, PENDING_CEO, APPROVED, EXECUTED, REJECTED
    
    const request = await getPrisma(req).staffingRequest.update({
      where: { id },
      data: { status }
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staffing request status' });
  }
});

// ==========================================
// CANDIDATES
// ==========================================

router.get('/candidates', async (req: any, res: any) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    if (status) {
      whereClause = { status: status as string };
    }

    const candidates = await getPrisma(req).candidate.findMany({
      where: whereClause,
      include: {
        staffingRequest: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

router.post('/candidates', async (req: any, res: any) => {
  try {
    const { staffingRequestId, firstName, lastName, email, phone, resumeUrl } = req.body;
    
    const candidate = await getPrisma(req).candidate.create({
      data: {
        staffingRequestId,
        firstName,
        lastName,
        email,
        phone,
        resumeUrl,
        status: 'RESUME_BANK'
      }
    });
    res.status(201).json(candidate);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

router.put('/candidates/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // HR_SCREEN, INTERVIEW_PANEL, CAF, HIRED, REJECTED
    
    const candidate = await getPrisma(req).candidate.update({
      where: { id },
      data: { status }
    });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate status' });
  }
});

// ==========================================
// INTERVIEWS
// ==========================================

router.post('/interviews', async (req: any, res: any) => {
  try {
    const { candidateId, interviewerId, scheduledAt } = req.body;
    
    const interview = await getPrisma(req).interview.create({
      data: {
        candidateId,
        interviewerId,
        scheduledAt: new Date(scheduledAt),
        result: 'PENDING'
      }
    });
    res.status(201).json(interview);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

router.put('/interviews/:id/result', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { result, feedback } = req.body; // PASS, FAIL
    
    const interview = await getPrisma(req).interview.update({
      where: { id },
      data: { result, feedback }
    });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interview result' });
  }
});

export default router;
