"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { BrainCircuit, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert(error.message);
    else alert("Magic link sent! Check your inbox.");
    setLoading(false);
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-card p-8 rounded-xl border border-border text-center max-w-md w-full shadow-2xl">
        <BrainCircuit className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">SkillGraph AI Access</h1>
        <p className="text-muted-foreground mb-8 text-sm">Secure your session to generate deterministic competency evaluations.</p>
        
        <form onSubmit={handleEmailAuth} className="mb-6">
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-input rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md transition-all disabled:opacity-50 flex items-center justify-center"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="relative flex py-2 items-center mb-6">
          <div className="grow border-t border-border"></div>
          <span className="shrink-0 mx-4 text-muted-foreground text-xs uppercase">Or continue with</span>
          <div className="grow border-t border-border"></div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleOAuth('github')}
            className="w-full flex items-center justify-center gap-3 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-all"
          >
            {/* Simple Icons CDN: Black in light mode, White in dark mode */}
            <Image height={20} width={20} src="https://cdn.simpleicons.org/github/white/black" alt="GitHub" /> 
            GitHub
          </button>
          <button 
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 bg-white text-black border border-neutral-200 dark:border-none font-semibold py-2.5 px-4 rounded-lg hover:bg-neutral-100 transition-all"
          >
            {/* Simple Icons CDN: Default brand colors */}
            <Image height={20} width={20} src="https://cdn.simpleicons.org/google" alt="Google" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}