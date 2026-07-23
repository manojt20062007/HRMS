import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AllEmployeesPage } from './pages/employees/AllEmployeesPage';
import { AssignRolePage } from './pages/employees/AssignRolePage';
import { AssignProjectPage } from './pages/employees/AssignProjectPage';
import { EmployeeDetailsWizard } from './pages/employees/EmployeeDetailsWizard';
import { EditEmployeeWizard } from './pages/employees/EditEmployeeWizard';
import { LoginPage } from './pages/auth/LoginPage';

// Leave & Attendance
import { HolidaysPage } from './pages/leave/HolidaysPage';
import { LeaveStatusPage } from './pages/leave/LeaveStatusPage';
import { LeaveRequestedPage } from './pages/leave/LeaveRequestedPage';
import { LeaveRequestPage } from './pages/leave/LeaveRequestPage';
import { DailyAttendancePage } from './pages/attendance/DailyAttendancePage';
import { OverallAttendancePage } from './pages/attendance/OverallAttendancePage';
import { AttendanceViewPage } from './pages/attendance/AttendanceViewPage';
import { AttendanceDetailsPage } from './pages/attendance/AttendanceDetailsPage';

// Travel Management
import { TravelExpensesPage } from './pages/travel/TravelExpensesPage';
import { TravelApprovalL1Page } from './pages/travel/TravelApprovalL1Page';
import { TravelApprovalL2Page } from './pages/travel/TravelApprovalL2Page';

// Performance Management
import { ObjectiveUserPage } from './pages/performance/ObjectiveUserPage';
import { ObjectiveManagerPage } from './pages/performance/ObjectiveManagerPage';
import { AppraisalProcessPage } from './pages/performance/AppraisalProcessPage';
import { AppraisalUserPage } from './pages/performance/AppraisalUserPage';
import { AppraisalManagerPage } from './pages/performance/AppraisalManagerPage';
import { AppraisalReviewerPage } from './pages/performance/AppraisalReviewerPage';
import { AppraisalHRPage } from './pages/performance/AppraisalHRPage';

// Recruitment
import { StaffingRequestPage } from './pages/recruitment/StaffingRequestPage';
import { StaffingListPage } from './pages/recruitment/StaffingListPage';
import { StaffingListRMPage } from './pages/recruitment/StaffingListRMPage';
import { StaffingListHRPage } from './pages/recruitment/StaffingListHRPage';
import { StaffingListCTOPage } from './pages/recruitment/StaffingListCTOPage';
import { StaffingListCEOPage } from './pages/recruitment/StaffingListCEOPage';
import { StaffingListExecutorPage } from './pages/recruitment/StaffingListExecutorPage';
import { HrScreenListPage } from './pages/recruitment/HrScreenListPage';
import { ResumeBankListPage } from './pages/recruitment/ResumeBankListPage';
import { InterviewPanelPage } from './pages/recruitment/InterviewPanelPage';
import { CafListPage } from './pages/recruitment/CafListPage';

// Payroll
import { PayrollPage } from './pages/payroll/PayrollPage';

// Reports
import { DesignationHistoryReport } from './pages/reports/DesignationHistoryReport';
import { LoginReport } from './pages/reports/LoginReport';
import { LeaveReport } from './pages/reports/LeaveReport';
import { AttendanceReport } from './pages/reports/AttendanceReport';
import { LeaveBalanceReport } from './pages/reports/LeaveBalanceReport';
import { PermissionReport } from './pages/reports/PermissionReport';

// Settings
import { ClientMasterPage } from './pages/settings/ClientMasterPage';
import { DesignationListPage } from './pages/settings/DesignationListPage';
import { DepartmentListPage } from './pages/settings/DepartmentListPage';
import { EmployeeVisitTypeMasterPage } from './pages/settings/EmployeeVisitTypeMasterPage';
import { PolicyListPage } from './pages/settings/PolicyListPage';
import { DomainMasterPage } from './pages/settings/DomainMasterPage';
import { SourceOfPanelMasterPage } from './pages/settings/SourceOfPanelMasterPage';
import { PayrollSettingsPage } from './pages/settings/PayrollSettingsPage';
import { RolePage } from './pages/settings/RolePage';
import { LeaveTimeSettingsPage } from './pages/settings/LeaveTimeSettingsPage';

// More Menu
import { HrAnnouncementListPage } from './pages/more/HrAnnouncementListPage';
import { MdSpeakListPage } from './pages/more/MdSpeakListPage';
import { LeadsListPage } from './pages/more/LeadsListPage';
import { UkLeadsListPage } from './pages/more/UkLeadsListPage';
import { AssetMasterPage } from './pages/more/AssetMasterPage';
import { EmployeeAssetListPage } from './pages/more/EmployeeAssetListPage';
import { ProjectMasterPage } from './pages/more/ProjectMasterPage';
import { ProjectListPage } from './pages/more/ProjectListPage';
import { ProcessMasterListPage } from './pages/more/ProcessMasterListPage';
import { ModuleMasterPage } from './pages/more/ModuleMasterPage';
import { CalendarPage } from './pages/attendance/CalendarPage';
import { ResignationListPage } from './pages/employee/ResignationListPage';
import { ResignationApprovalL1Page } from './pages/resignation/ResignationApprovalL1Page';
import { ResignationApprovalL2Page } from './pages/resignation/ResignationApprovalL2Page';

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('hrms_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes (Dashboard) */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          
          {/* Employees */}
          <Route path="employees/all" element={<AllEmployeesPage />} />
          <Route path="employees/new" element={<EmployeeDetailsWizard />} />
          <Route path="employees/:id/edit" element={<EditEmployeeWizard />} />
          <Route path="employees/assign-role" element={<AssignRolePage />} />
          <Route path="employees/assign-project" element={<AssignProjectPage />} />
          {/* Leave & Attendance Routes */}
          <Route path="leave/holidays" element={<HolidaysPage />} />
          <Route path="leave/status" element={<LeaveStatusPage />} />
          <Route path="leave/requested" element={<LeaveRequestedPage />} />
          <Route path="leave/request" element={<LeaveRequestPage />} />
          
          <Route path="attendance/daily" element={<DailyAttendancePage />} />
          <Route path="attendance/overall" element={<OverallAttendancePage />} />
          <Route path="attendance/details/view" element={<AttendanceViewPage />} />
          <Route path="attendance/details" element={<AttendanceDetailsPage />} />
          
          {/* Travel Management Routes */}
          <Route path="travel/expenses" element={<TravelExpensesPage />} />
          <Route path="travel/l1" element={<TravelApprovalL1Page />} />
          <Route path="travel/l2" element={<TravelApprovalL2Page />} />
          
          {/* Performance Management Routes */}
          <Route path="performance/objective-user" element={<ObjectiveUserPage />} />
          <Route path="performance/objective-manager" element={<ObjectiveManagerPage />} />
          <Route path="performance/appraisal-process" element={<AppraisalProcessPage />} />
          <Route path="performance/appraisal-user" element={<AppraisalUserPage />} />
          <Route path="performance/appraisal-manager" element={<AppraisalManagerPage />} />
          <Route path="performance/appraisal-reviewer" element={<AppraisalReviewerPage />} />
          <Route path="performance/appraisal-hr" element={<AppraisalHRPage />} />
          
          {/* Recruitment Routes */}
          <Route path="recruitment/staffing-request" element={<StaffingRequestPage />} />
          <Route path="recruitment/staffing-list" element={<StaffingListPage />} />
          <Route path="recruitment/staffing-list-rm" element={<StaffingListRMPage />} />
          <Route path="recruitment/staffing-list-hr" element={<StaffingListHRPage />} />
          <Route path="recruitment/staffing-list-cto" element={<StaffingListCTOPage />} />
          <Route path="recruitment/staffing-list-ceo" element={<StaffingListCEOPage />} />
          <Route path="recruitment/staffing-list-executor" element={<StaffingListExecutorPage />} />
          <Route path="recruitment/hrscreen" element={<HrScreenListPage />} />
          <Route path="recruitment/resume-bank" element={<ResumeBankListPage />} />
          <Route path="recruitment/interview-panel" element={<InterviewPanelPage />} />
          <Route path="recruitment/caf" element={<CafListPage />} />
          
          {/* Payroll Routes */}
          <Route path="payroll" element={<PayrollPage />} />
          
          {/* Reports Routes */}
          <Route path="reports/designation" element={<DesignationHistoryReport />} />
          <Route path="reports/login" element={<LoginReport />} />
          <Route path="reports/leave" element={<LeaveReport />} />
          <Route path="reports/attendance" element={<AttendanceReport />} />
          <Route path="reports/leave-balance" element={<LeaveBalanceReport />} />
          <Route path="reports/permission" element={<PermissionReport />} />
          
          {/* Settings Routes */}
          <Route path="settings/role" element={<RolePage />} />
          <Route path="settings/leave" element={<LeaveTimeSettingsPage />} />
          <Route path="settings/client/list" element={<ClientMasterPage />} />
          <Route path="settings/employee/designation" element={<DesignationListPage />} />
          <Route path="settings/employee/department" element={<DepartmentListPage />} />
          <Route path="settings/employee/visit" element={<EmployeeVisitTypeMasterPage />} />
          <Route path="settings/policy" element={<PolicyListPage />} />
          <Route path="settings/source/domain" element={<DomainMasterPage />} />
          <Route path="settings/source/panel" element={<SourceOfPanelMasterPage />} />
          <Route path="settings/payroll-settings" element={<PayrollSettingsPage />} />
          
          {/* More Menu Routes */}
          <Route path="more/hr-announcement" element={<HrAnnouncementListPage />} />
          <Route path="more/md-speak" element={<MdSpeakListPage />} />
          <Route path="more/leads/list" element={<LeadsListPage />} />
          <Route path="more/leads/uk-list" element={<UkLeadsListPage />} />
          <Route path="more/assets/master" element={<AssetMasterPage />} />
          <Route path="more/assets/list" element={<EmployeeAssetListPage />} />
          <Route path="more/projects/master" element={<ProjectMasterPage />} />
          <Route path="more/projects/list" element={<ProjectListPage />} />
          <Route path="more/projects/process" element={<ProcessMasterListPage />} />
          <Route path="more/projects/module" element={<ModuleMasterPage />} />

          {/* Attendance Routes */}
          <Route path="attendance/calendar" element={<CalendarPage />} />
          
          {/* Employee Routes */}
          <Route path="employee/resignation-list" element={<ResignationListPage />} />
          
          {/* Resignation Routes */}
          <Route path="resignation/approval-l1" element={<ResignationApprovalL1Page />} />
          <Route path="resignation/approval-l2" element={<ResignationApprovalL2Page />} />
          
          <Route path="*" element={<div className="p-6 text-center text-slate-500">Page under construction</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
