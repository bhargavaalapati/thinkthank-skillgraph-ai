"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";
import {Mail, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Magic link dispatched! Check your inbox.");
      setEmail("");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message);
  };

  const handleDemoBypass = () => {
    localStorage.setItem("skillgraph_demo_user", "mock_judge_session_123");
    toast.success("Demo Fast-Pass authenticated.");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="bg-card p-8 rounded-xl border border-border text-center max-w-md w-full shadow-2xl">
        <Image src="/icon.svg" alt="SkillGraph AI Logo" width={40} height={40} className="w-10 h-10" />
        <h1 className="text-2xl font-bold mb-2">SkillGraph AI Access</h1>
        <p className="text-muted-foreground mb-6 text-sm">Secure your session to generate deterministic competency evaluations.</p>
        
        <button onClick={handleDemoBypass} className="w-full mb-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg">
          <Sparkles className="w-4 h-4" /> Instant Demo Fast-Pass
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="grow border-t border-border"></div>
          <span className="shrink-0 mx-4 text-muted-foreground text-xs uppercase">Or use Magic Link</span>
          <div className="grow border-t border-border"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="mb-6">
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-input rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md transition-all disabled:opacity-50 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <button onClick={() => handleOAuth('github')} className="w-full flex items-center justify-center gap-3 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </button>
          <button onClick={() => handleOAuth('google')} className="w-full flex items-center justify-center gap-3 bg-white text-black border border-neutral-200 dark:border-none font-semibold py-2.5 px-4 rounded-lg hover:bg-neutral-100 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.31 7.23 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.4l4.09-3.16z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.69 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}