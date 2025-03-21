
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-agri-green p-8 text-white justify-center items-center">
        <div className="max-w-md">
          <div className="mb-8 space-y-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-10 w-10" />
              <h1 className="text-3xl font-bold font-display">AgriTrust</h1>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">Sustainable Agriculture Marketplace</h2>
              <p className="text-white/80">
                Connecting farmers and consumers directly through a transparent, 
                sustainable, and ethical marketplace.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-medium">Farmer Verification</h3>
                  <p className="text-sm text-white/70 mt-1">Verified sustainable farming practices</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-medium">EcoPassport</h3>
                  <p className="text-sm text-white/70 mt-1">Track products from farm to table</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-medium">Direct Market</h3>
                  <p className="text-sm text-white/70 mt-1">No middlemen, fair prices</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-medium">Community</h3>
                  <p className="text-sm text-white/70 mt-1">Connect with like-minded people</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-soft">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center space-x-2 justify-center mb-6">
              <Leaf className="h-8 w-8 text-agri-green" />
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                Agri<span className="text-agri-green">Trust</span>
              </h2>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>
          
          {/* Auth Form Container */}
          <div className="bg-white rounded-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
