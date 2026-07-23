// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import MainLayout     from '../layouts/MainLayout';

// Public pages
import Home     from '../pages/Home/Home';
import Login    from '../pages/Login/Login';
import NotFound from '../pages/Error/NotFound';

// Admin pages
import AdminDashboard   from '../pages/Admin/Dashboard';
import ClassManagement  from '../pages/Admin/ClassManagement';
import EditStudent      from '../pages/Admin/EditStudent';
import StudentDatabase  from '../pages/Admin/StudentDatabase';
import Teachers         from '../pages/Admin/Teachers';
import Parents          from '../pages/Admin/Parents';
import Analytics        from '../pages/Admin/Analytics';

// Teacher pages
import TeacherDashboard    from '../pages/Teacher/Dashboard';
import StudentList         from '../pages/Teacher/StudentList';
import StudentEvaluation   from '../pages/Teacher/StudentEvaluation';
import History             from '../pages/Teacher/History';
import TeacherReports      from '../pages/Teacher/Reports';

// Parent pages
import ParentDashboard  from '../pages/Parent/Dashboard';
import StudentProfile   from '../pages/Parent/StudentProfile';
import Progress         from '../pages/Parent/Progress';
import ParentReports    from '../pages/Parent/Reports';
import DownloadPDF      from '../pages/Parent/DownloadPDF';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ───────────────────────────────────────── */}
      <Route path="/"      element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* ── Admin portal ─────────────────────────────────── */}
      <Route element={
        <ProtectedRoute roles={['admin']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin"            element={<AdminDashboard />} />
        <Route path="/admin/students"    element={<StudentDatabase />} />
        <Route path="/admin/classes"     element={<ClassManagement />} />
        <Route path="/admin/add-student" element={<Navigate to="/admin/classes" replace />} />
        <Route path="/admin/edit/:id"    element={<EditStudent />} />
        <Route path="/admin/teachers"    element={<Teachers />} />
        <Route path="/admin/parents"    element={<Parents />} />
        <Route path="/admin/analytics"  element={<Analytics />} />
      </Route>


      {/* ── Teacher portal ───────────────────────────────── */}
      <Route element={
        <ProtectedRoute roles={['teacher', 'admin']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/teacher"           element={<TeacherDashboard />} />
        <Route path="/teacher/students"  element={<StudentList />} />
        <Route path="/teacher/evaluate"  element={<StudentEvaluation />} />
        <Route path="/teacher/history"   element={<History />} />
        <Route path="/teacher/reports"   element={<TeacherReports />} />
      </Route>

      {/* ── Parent portal ────────────────────────────────── */}
      <Route element={
        <ProtectedRoute roles={['parent']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/parent"           element={<ParentDashboard />} />
        <Route path="/parent/profile"   element={<StudentProfile />} />
        <Route path="/parent/progress"  element={<Progress />} />
        <Route path="/parent/reports"   element={<ParentReports />} />
        <Route path="/parent/download"  element={<DownloadPDF />} />
      </Route>

      {/* ── Fallback ─────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
