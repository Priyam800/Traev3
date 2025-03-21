
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPassword';

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
