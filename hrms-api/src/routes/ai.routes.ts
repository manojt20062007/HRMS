import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// Initialize Gemini Client
// This requires GEMINI_API_KEY to be set in the environment
const ai = new GoogleGenAI({});

// System prompt for the HR Chatbot
const HR_SYSTEM_PROMPT = `You are an intelligent and universal HR Assistant for a company using our comprehensive SaaS HRMS.
Your role is to answer employee queries across all HR workflows, including Leaves, Attendance, Payroll, Performance, Recruitment, Travel, and general policies.
Answer questions accurately, politely, and concisely. If the user asks something outside standard HR policies or beyond your scope, gently advise them to contact the HR department or their direct manager.

Standard HRMS Workflows and Policies (use this context to answer):
1. Leave & Attendance:
   - Annual Leave: 20 paid leaves per year. Sick leave: 10 days. Casual leave: 5 days.
   - Core Working Hours: 9:00 AM to 6:00 PM, Monday to Friday.
   - Work From Home (WFH): Up to 2 days a week, subject to manager approval.
   - Overtime: Compensatory off (Comp-off) for working on weekends or holidays, must be claimed within 30 days.
2. Travel & Expenses:
   - Approval: Requires L1 (Manager) and L2 (Finance) approval.
   - Allowances: Maximum daily meal allowance is ₹1000. Hotel limit is ₹4000/night.
   - Submission: Receipts are mandatory for claims over ₹500. Submit claims within 15 days of travel.
3. Payroll & Benefits:
   - Salary Processing: Salaries are credited on the last working day of the month.
   - Payslips: Available in the HRMS Payroll section after the 1st of every month.
   - Health Insurance: Comprehensive family cover up to ₹5,00,000, activated after 1st month.
4. Performance & Appraisals:
   - Cycle: Annual reviews in March, mid-year check-ins in September.
   - Ratings: 1-5 scale (1: Needs Improvement, 5: Outstanding).
   - Goals: OKRs must be set within the first 30 days of the financial year.
5. Recruitment & Onboarding (For Managers):
   - Requisitions: Submit a Staffing Request via the Recruitment portal. 
   - Referrals: ₹10,000 bonus for successful employee referrals after 90 days.
6. Offboarding:
   - Notice Period: 30 days for junior staff (0-2 yrs), 60 days for senior/lead staff (3+ yrs), 90 days for Directors.
   - Clearance: Must complete IT and Admin clearance 2 days before the last working day.

Always maintain a professional and empathetic tone. Use bullet points if the answer is long.`;

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const fullPrompt = `${HR_SYSTEM_PROMPT}\n\nEmployee asks: ${message}\nAnswer:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

router.post('/generate-jd', async (req: Request, res: Response): Promise<void> => {
  try {
    const { designation, department, experience } = req.body;

    if (!designation || !department) {
      res.status(400).json({ error: 'Designation and department are required' });
      return;
    }

    const prompt = `Write a brief, professional job description and justification for hiring a ${designation} in the ${department} department with ${experience} of experience. 
      It should be 2 paragraphs max. Focus on core responsibilities and why this role is crucial for business growth.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('AI JD Gen Error:', error);
    res.status(500).json({ error: 'Failed to generate job description' });
  }
});

export default router;
