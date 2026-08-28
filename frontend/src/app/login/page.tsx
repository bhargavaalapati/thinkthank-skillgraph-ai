"use client";

import { signInWithGitHub } from "@/lib/supabase";
import { BrainCircuit, GitBranch } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 text-center max-w-md w-full shadow-2xl">
        <BrainCircuit className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">SkillGraph AI Access</h1>
        <p className="text-neutral-400 mb-8 text-sm">Secure your session to generate deterministic competency evaluations.</p>
        
        <button 
          onClick={signInWithGitHub}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-neutral-200 transition-all"
        >
          <GitBranch className="w-5 h-5" /> Continue with GitHub
        </button>
      </div>
    </div>
  );
}