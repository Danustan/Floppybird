import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LanguageSelection from './pages/LanguageSelection';
import ReportViolation from './pages/ReportViolation';
import ThankYou from './pages/ThankYou';
import ComplaintStatus from './pages/ComplaintStatus';
import AuthorityLogin from './pages/AuthorityLogin';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetails from './pages/ComplaintDetails';

import './styles/App.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LanguageSelection />} />
        <Route path="/report" element={<ReportViolation />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/status/:complaintId" element={<ComplaintStatus />} />
        <Route path="/complaint/:complaintId" element={<ComplaintDetails />} />
        <Route path="/authority/login" element={<AuthorityLogin />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
