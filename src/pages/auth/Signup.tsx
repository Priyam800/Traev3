
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <AuthLayout
      title="Create an Account"
      description="Join AgriTrust for sustainable food access"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
