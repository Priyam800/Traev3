
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import VerifyOTP from '@/components/auth/VerifyOTP';

const Verify: React.FC = () => {
  const location = useLocation();
  
  // If there's no email in the state, redirect to signup
  if (!location.state?.email) {
    return <Navigate to="/signup" replace />;
  }
  
  return (
    <AuthLayout
      title="Email Verification"
      description="Please verify your email address to continue"
    >
      <VerifyOTP />
    </AuthLayout>
  );
};

export default Verify;
