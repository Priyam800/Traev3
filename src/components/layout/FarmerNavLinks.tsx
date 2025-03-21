
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileSpreadsheet, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const FarmerNavLinks = () => {
  const { user } = useAuth();
  
  // Only show farmer links if user has farmer role
  if (!user?.user_metadata?.role || user.user_metadata.role !== 'farmer') {
    return null;
  }
  
  return (
    <>
      <h3 className="text-xs uppercase text-muted-foreground font-medium mt-6 mb-2 px-4">
        Farmer Portal
      </h3>
      <NavLink
        to="/farmer/products"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`
        }
      >
        <Package className="mr-2 h-5 w-5" />
        <span>My Products</span>
      </NavLink>
      <NavLink
        to="/farmer/orders"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 rounded-md ${
            isActive
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`
        }
      >
        <FileSpreadsheet className="mr-2 h-5 w-5" />
        <span>Orders</span>
      </NavLink>
    </>
  );
};

export default FarmerNavLinks;
