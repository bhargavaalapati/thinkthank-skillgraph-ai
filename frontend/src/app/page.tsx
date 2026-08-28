"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Activity, BrainCircuit, ShieldAlert, Database, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface Question {
  id: string;
  scenario: string;
  options: string[];
}

interface SkillScore {
  competency_name: string;
  competency_type: string;
  score: number;
  justification: string;
}

export default function SkillGraphDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ scores: SkillScore[] } | null>(null);
  
  const [policyText, setPolicyText] = useState("");
  const [ingesting, setIngesting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id);
      else router.push("/login");
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setUserId(session.user.id);
      else router.push("/login");
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const ingestPolicy = async () => {
    if (!policyText.trim() || !userId) return;
    setIngesting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ingest-policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, text: policyText, document_name: "Custom Policy Mandate" }),
      });
      if (!res.ok) throw new Error("Ingestion failed on backend");
      setPolicyText("");
      alert("Policy vectorized and added to Knowledge Base!");
    } catch (error) {
      console.error("Ingestion failed", error);
      alert("Ingestion failed. Is your backend running on port 8000?");
    }
    setIngesting(false);
  };

  const generateAssessment = async () => {
    if (!userId) return;
    setLoading(true);
    setResults(null);
    setAnswers({});
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role: "Section Officer", focus_area: "Digital Fluency" }),
      });
      
      if (res.status === 429) {
        alert("Rate limit exceeded. Please wait 60 seconds.");
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      if (data.questions) setAssessment(data.questions);
      else alert("Failed to generate valid questions.");
    } catch (error) {
      console.error("Failed to generate", error);
    }
    setLoading(false);
  };

  const submitEvaluation = async () => {
    if (!assessment || !userId) return;
    setLoading(true);
    try {
      const userAnswers = assessment.map((q) => ({
        question_id: q.id,
        scenario: q.scenario,
        selected_answer: answers[q.id] || q.options[0], // fallback if they miss one
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluate-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role: "Section Officer", answers: userAnswers }),
      });
      
      const data = await res.json();
      if (data.scores) {
        setResults(data);
      } else {
        alert("Evaluation failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to evaluate", error);
    }
    setLoading(false);
  };

  if (!userId) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading Session...</div>;

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <header className="mb-10 border-b border-border pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-blue-500 w-8 h-8" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SkillGraph <span className="text-blue-500">AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={handleSignOut} className="text-muted-foreground hover:text-foreground transition-colors" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" /> Organizational Knowledge Base
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Paste specific FRAC policy mandates or guidelines. The Agent will vectorize this into Supabase pgvector to ground your assessments.
            </p>
            <textarea 
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              placeholder="Paste policy context here..."
              className="w-full h-24 bg-background border border-input rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
            />
            <button 
              onClick={ingestPolicy}
              disabled={ingesting || !policyText.trim()}
              className="bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-black font-medium py-2 px-4 rounded-lg w-full transition-all disabled:opacity-50"
            >
              {ingesting ? "Vectorizing Context..." : "Inject into AI Memory"}
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Live Competency Engine
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Generate a Situational Judgment Test using Agentic RAG grounded in your knowledge base.
            </p>

            {!assessment && !results && (
              <button 
                onClick={generateAssessment}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg w-full transition-all disabled:opacity-50"
              >
                {loading ? "Agent Generating Scaffold..." : "Generate Role Assessment"}
              </button>
            )}

            {assessment && !results && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                {assessment.map((q, idx) => (
                  <div key={q.id} className="bg-muted p-4 rounded-lg border border-border">
                    <p className="text-sm text-blue-500 font-mono mb-2">Scenario {idx + 1}:</p>
                    <p className="text-sm leading-relaxed mb-4">{q.scenario}</p>
                    <div className="space-y-3">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-start gap-3 text-sm cursor-pointer hover:bg-background/50 p-2 rounded-md transition-colors">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            className="mt-1 shrink-0"
                          />
                          <span className="text-muted-foreground leading-snug">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={submitEvaluation}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg w-full transition-all disabled:opacity-50"
                >
                  {loading ? "Evaluating Deterministic Metrics..." : "Submit & Evaluate"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-xl flex flex-col items-center justify-center min-h-125">
          {results && results.scores && results.scores.length > 0 ? (
            <div className="w-full h-full animate-in zoom-in-95">
               <h3 className="text-lg font-semibold text-center mb-4">Competency Delta Map</h3>
               <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={results.scores}>
                      <PolarGrid stroke="currentColor" className="opacity-20" />
                      <PolarAngleAxis dataKey="competency_name" tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.7 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-4 p-4 bg-muted border border-border rounded-lg text-sm">
                 <p className="font-semibold flex items-center gap-2 mb-2">
                   <ShieldAlert className="w-4 h-4 text-amber-500"/> Audit Trail:
                 </p>
                 <p className="leading-relaxed text-xs text-muted-foreground">{results.scores[0]?.justification || "Data evaluated successfully."}</p>
               </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-center flex flex-col items-center">
              <Radar className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm">Awaiting evaluation data to plot capabilities...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}