import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-12 bg-white rounded-[40px] shadow-sm border border-gray-100 max-w-md w-full mx-4">
        <h1 className="mb-2 font-heading text-6xl font-extrabold text-primary">404</h1>
        <p className="mb-8 text-xl text-muted-foreground font-medium">Oops! Page not found</p>
        <a href="/" className="inline-block px-8 py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-sm">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
