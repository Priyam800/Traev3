
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
