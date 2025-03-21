
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="w-full flex justify-center mb-6">
          <img 
            src="https://images.unsplash.com/photo-1563301261-96f6a759b565?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Page not found" 
            className="h-48 w-auto object-cover rounded-lg"
          />
        </div>
        
        <h1 className="text-6xl font-bold text-agri-green mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            size="lg"
            asChild
            className="w-full sm:w-auto bg-agri-green hover:bg-agri-darkGreen"
          >
            <Link to="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
