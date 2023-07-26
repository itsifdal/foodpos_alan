import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route from react-router-dom
import HomePage from './HomePage';
import OrderPage from './OrderPage';
import './index.css';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/order-page" element={<OrderPage />} />
    </Routes>
  );
};

export default AppRoutes;
