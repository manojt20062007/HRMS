import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

// Create or Update Employee (Upsert)
router.post('/', async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    
    const {
      firstName, lastName, nameAsAadhaar, email, mobile,
      aadhaarNo, panNo, nationality, gender, dob, age,
      bloodGroup, religion, maritalStatus, physicallyChallenged,
      password = 'password123',
      roleId,

      employeeIdString, professionalEmail, employmentStatus, joiningDate, salary, pfNo, esiNo, reportingToId,
      department, designation,
      families = [],
      bank,
      address,
      qualifications = [],
      experiences = [],
      certificates = [],
      experienceType, totalExperienceYears, referenceName, referenceMobile
    } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, First Name, and Last Name are required' });
    }

    // 1. Role fallback
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const defaultRole = await prisma.role.findFirst({ where: { name: 'EMPLOYEE' } });
      if (defaultRole) {
        finalRoleId = defaultRole.id;
      } else {
        const newRole = await prisma.role.create({ data: { name: 'EMPLOYEE' } });
        finalRoleId = newRole.id;
      }
    }

    // 2. Upsert User
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      if (!password) {
        return res.status(400).json({ error: 'Password is required for new employee registrations' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: { email, password: hashedPassword, roleId: finalRoleId }
      });
    } else if (password) {
      // If user exists and a new password is provided, update it
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
    }

    // 3. Prepare Employee Data
    const employeeData = {
      firstName,
      lastName,
      personalEmail: email,
      mobileNumber: mobile,
      aadhaarName: nameAsAadhaar,
      aadhaarNo,
      panNo,
      nationality,
      gender,
      dob: dob ? new Date(dob) : null,
      bloodGroup,
      religion,
      maritalStatus,
      physicallyChallenged: physicallyChallenged === 'YES',

      employeeIdString: employeeIdString || null,
      professionalEmail: professionalEmail || null,
      employmentStatus: employmentStatus || null,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
      salary: salary ? parseFloat(salary) : null,
      pfNo: pfNo || null,
      esiNo: esiNo || null,
      reportingToId: reportingToId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportingToId) ? reportingToId : null,

      // Department & Designation stored as strings (names)
      department: department || null,
      designation: designation || null,

      experienceType: experienceType || null,
      totalExperienceYears: totalExperienceYears ? parseFloat(totalExperienceYears) : null,
      referenceName: referenceName || null,
      referenceMobile: referenceMobile || null,

      families: {
        create: families.map((f: any) => ({
          name: f.name,
          relation: f.relation,
          dob: f.dob ? new Date(f.dob) : null,
          bloodGroup: f.bloodGroup,
          occupation: f.occupation
        }))
      },
      qualifications: {
        create: qualifications.map((q: any) => ({
          degree: q.degree,
          institution: q.institution,
          yearOfPassing: q.yearOfPassing,
          grade: q.grade,
          documentUrl: q.documentUrl
        }))
      },
      experiences: {
        create: experiences.map((e: any) => ({
          jobTitle: e.jobTitle,
          companyName: e.companyName,
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
          documentUrl: e.documentUrl
        }))
      },
      certificates: {
        create: certificates.map((c: any) => ({
          name: c.name,
          documentUrl: c.documentUrl
        }))
      }
    };

    // 4. Check if Employee exists
    let employee = await prisma.employee.findUnique({ where: { userId: user.id } });

    if (!employee) {
      employee = await prisma.employee.create({
        data: {
          userId: user.id,
          ...employeeData
        }
      });
    } else {
      // Clear old lists to replace them
      await prisma.employeeFamily.deleteMany({ where: { employeeId: employee.id } });
      await prisma.employeeQualification.deleteMany({ where: { employeeId: employee.id } });
      await prisma.employeeExperience.deleteMany({ where: { employeeId: employee.id } });
      await prisma.employeeCertificate.deleteMany({ where: { employeeId: employee.id } });
      
      // Also delete Bank and Address to replace them
      await prisma.employeeBank.deleteMany({ where: { employeeId: employee.id } });
      await prisma.employeeAddress.deleteMany({ where: { employeeId: employee.id } });

      employee = await prisma.employee.update({
        where: { id: employee.id },
        data: employeeData
      });
    }

    // 5. Create Bank (1 to 1) - Check if it actually has data
    if (bank && Object.keys(bank).length > 0 && bank.bankName) {
      await prisma.employeeBank.create({
        data: {
          employeeId: employee.id,
          bankName: bank.bankName || '',
          accountName: bank.accountName || '',
          accountNumber: bank.accountNumber || '',
          ifscCode: bank.ifscCode || '',
          branch: bank.branch || ''
        }
      });
    }

    // 6. Create Address (1 to 1) - Check if it actually has data
    if (address && Object.keys(address).length > 0 && address.street) {
      await prisma.employeeAddress.create({
        data: {
          employeeId: employee.id,
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || '',
          country: address.country || ''
        }
      });
    }

    res.status(201).json({ message: 'Employee saved successfully', employee });
  } catch (error: any) {
    console.error('Error saving employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all employees
router.get('/', async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          include: { role: true }
        }
      }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single employee by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: { include: { role: true } },
        families: true,
        bank: true,
        address: true,
        qualifications: true,
        experiences: true,
        certificates: true,
      }
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee by ID (also deletes associated user)
router.delete('/:id', async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;

    // Find the employee to get their userId
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Manually delete all FK-constrained relations that don't have onDelete: Cascade
    // 1. Staffing requests where this employee was the requester
    await prisma.staffingRequest.deleteMany({ where: { requestedById: id } });

    // 2. Interviews conducted by this employee
    await prisma.interview.deleteMany({ where: { interviewerId: id } });

    // 3. Payroll records
    await prisma.payrollRecord.deleteMany({ where: { employeeId: id } });

    // 4. Salary component
    await prisma.salaryComponent.deleteMany({ where: { employeeId: id } });

    // 5. Employee project assignments
    await prisma.employeeProject.deleteMany({ where: { employeeId: id } });

    // 6. Unassign assets (set assignedToId to null rather than deleting assets)
    await prisma.asset.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null }
    });

    // 7. Leave requests where this employee was the approver
    await prisma.leaveRequest.updateMany({
      where: { approvedById: id },
      data: { approvedById: null }
    });

    // Cascade-deleted automatically (onDelete: Cascade in schema):
    // - EmployeeFamily, EmployeeBank, EmployeeAddress
    // - EmployeeQualification, EmployeeExperience, EmployeeCertificate
    // - AttendanceRecord, TravelExpense, ResignationRequest
    // - LeaveRequest (as requestor)

    // Now safe to delete the employee
    await prisma.employee.delete({ where: { id } });

    // Also delete the linked user account
    await prisma.user.delete({ where: { id: employee.userId } });

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Assign Role and Reporting managers
router.put('/:id/assign-role', async (req: any, res: any) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    const { roleId, reportingToId } = req.body;

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update Employee's reportingToId
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        reportingToId: reportingToId || null,
      }
    });

    // Update Employee's User Role
    if (roleId) {
      await prisma.user.update({
        where: { id: employee.userId },
        data: { roleId }
      });
    }

    res.json({ success: true, message: 'Role and reporting details updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
