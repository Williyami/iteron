import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy-load every page so each route is a separate chunk
const Index     = lazy(() => import("./pages/Index.tsx"));
const Browse    = lazy(() => import("./pages/Browse.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const About     = lazy(() => import("./pages/About.tsx"));
const NotFound  = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<Index />} />
            <Route path="/browse"    element={<Browse />} />
            <Route path="/about"     element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
