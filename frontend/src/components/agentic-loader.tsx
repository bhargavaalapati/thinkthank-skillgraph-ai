"use client";

import { motion } from "framer-motion";
import { Database, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { BrainCircuit } from "lucide-react";

export function AgenticLoader({ message }: { message: string }) {
  const steps = [
    { icon: Database, text: "Querying pgvector knowledge base..." },
    { icon: BrainCircuit, text: "Aligning KCM parameters..." },
    { icon: ShieldCheck, text: "Structuring deterministic evaluation..." },
  ];

  return (
    <div className="p-8 bg-muted/50 border border-border rounded-xl flex flex-col items-center justify-center min-h-75">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="mb-6"
      >
        <Image src="/icon.svg" alt="SkillGraph AI Logo" width={40} height={40} className="w-10 h-10" />
      </motion.div>
      <h3 className="text-lg font-mono text-blue-500 font-semibold mb-6">{message}</h3>
      
      <div className="space-y-4 w-full max-w-sm">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.8, duration: 0.5 }}
            className="flex items-center gap-3 text-sm text-muted-foreground bg-background p-3 rounded-md border border-border shadow-sm"
          >
            <step.icon className="w-4 h-4 text-emerald-500" />
            {step.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}