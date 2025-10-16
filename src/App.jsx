import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EstimateList from './pages/EstimateList.jsx';
import EstimateForm from './pages/EstimateForm.jsx';
import EstimatePrint from './pages/EstimatePrint.jsx';
export default function App(){ return (
  <Routes>
    <Route path="/" element={<Navigate to="/estimates" />} />
    <Route path="/estimates" element={<EstimateList />} />
    <Route path="/estimates/new" element={<EstimateForm />} />
    <Route path="/estimates/print/:id" element={<EstimatePrint />} />
  </Routes>
)};
