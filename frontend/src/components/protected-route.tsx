"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuth = async () => {
      const demoUser = typeof window !== "undefined" ? localStorage.getItem("skillgraph_demo_user") : null;
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = Boolean(demoUser || session);

      if (!mounted) return;

      if (isAuthenticated && pathname === "/login") {
        router.replace("/");
      } else if (!isAuthenticated && pathname !== "/login") {
        router.replace("/login");
      } else {
        // Slight delay ensures the router processes before unmounting the loader
        setTimeout(() => { if (mounted) setLoading(false); }, 300);
      }
    };

    handleAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const demoUser = typeof window !== "undefined" ? localStorage.getItem("skillgraph_demo_user") : null;
      const isAuthenticated = Boolean(demoUser || session);
      
      if (isAuthenticated && pathname === "/login") {
        router.replace("/");
      } else if (!isAuthenticated && pathname !== "/login") {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
        {/* True Gemini Sliding Top Loader */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
          <motion.div 
            className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500 w-1/2"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
        </div>
        
        {/* Bouncing Logo */}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <BrainCircuit className="w-12 h-12 text-blue-500 mb-4" />
        </motion.div>
        <p className="text-sm font-mono text-muted-foreground animate-pulse">Securing Agentic Pipeline...</p>
      </div>
    );
  }

  return <>{children}</>;
}