"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Activity, BrainCircuit, ShieldAlert } from "lucide-react";

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

interface AssessmentResult {
  scores: SkillScore[];
  overall_feedback: string;
}

export default function SkillGraphDashboard() {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Question[] | null>(null);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const generateAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "Section Officer", focus_area: "Digital Fluency" }),
      });
      const data = await res.json();
      setAssessment(data.questions);
    } catch (error) {
      console.error("Failed to generate", error);
    }
    setLoading(false);
  };

  const submitEvaluation = async () => {
    if (!assessment) return;
    setLoading(true);
    try {
      const mockAnswers = assessment.map((q) => ({
        question_id: q.id,
        scenario: q.scenario,
        selected_answer: q.options[0], 
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluate-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "demo-user-123", role: "Section Officer", answers: mockAnswers }),
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to evaluate", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-10 font-sans selection:bg-blue-500/30">
      <header className="mb-10 border-b border-neutral-800 pb-6 flex items-center gap-3">
        <BrainCircuit className="text-blue-500 w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-tight">SkillGraph <span className="text-blue-500">AI</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" /> Live Competency Engine
          </h2>
          <p className="text-neutral-400 mb-6 text-sm">
            Dynamically generate a Situational Judgment Test aligned with the Karmayogi Competency Model.
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
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                <p className="text-sm text-blue-400 font-mono mb-2">Generated Scenario:</p>
                <p className="text-sm leading-relaxed">{assessment[0].scenario}</p>
              </div>
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

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl flex flex-col items-center justify-center min-h-100">
          {results ? (
            <div className="w-full h-full animate-in zoom-in-95">
               <h3 className="text-lg font-semibold text-center mb-4">Competency Delta Map</h3>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={results.scores}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="competency_name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#4b5563' }} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-4 p-4 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-300">
                 <p className="font-semibold text-white flex items-center gap-2 mb-2">
                   <ShieldAlert className="w-4 h-4 text-amber-500"/> Audit Trail:
                 </p>
                 <p className="leading-relaxed text-xs">{results.scores[0].justification}</p>
               </div>
            </div>
          ) : (
            <div className="text-neutral-600 text-center flex flex-col items-center">
              <Radar className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm">Awaiting evaluation data to plot capabilities...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}