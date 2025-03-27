
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="text-center max-w-md space-y-6 animate-fade-in">
        <h1 className="text-6xl font-bold text-primary/80">404</h1>
        <h2 className="text-2xl font-medium">Page not found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
