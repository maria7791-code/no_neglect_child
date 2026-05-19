import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, AlertCircle, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

interface AnalysisResult {
  summary: string;
  topRisks: string[];
  recommendations: string[];
}

export default function AdminPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      if (!db) return;
      const snapshot = await getDocs(collection(db, "reports"));
      setReportCount(snapshot.size);
    }
    loadStats();
  }, []);

  const runAnalysis = async () => {
    if (!db) return;
    setAnalyzing(true);
    try {
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(20));
      const snapshot = await getDocs(q);
      const reports = snapshot.docs.map(doc => ({
        type: doc.data().type,
        description: doc.data().description,
        location: doc.data().location
      }));

      const res = await fetch("/api/analyze-safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reports })
      });
      
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-dark mb-4">관리자 대시보드</h1>
          <p className="text-gray-500">회기동의 안전 데이터를 통합 관리하고 AI로 분석합니다.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-muted shadow-sm flex items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-xl">
            <BarChart3 className="text-primary w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">총 신고 건수</div>
            <div className="text-xl font-black">{reportCount}건</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Control Panel */}
        <div className="lg:col-span-1">
          <div className="bg-dark rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden h-full">
            <div className="relative z-10">
              <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-4">AI 안전 분석</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Gemini AI가 최근 누적된 신고 데이터를 분석하여 마을의 공통적인 위험 패턴을 찾아내고 해결책을 제시합니다.
              </p>
              
              <button
                onClick={runAnalysis}
                disabled={analyzing || reportCount === 0}
                className={cn(
                  "btn-primary w-full py-4 text-dark font-bold rounded-2xl flex items-center justify-center gap-2 transition-all",
                  analyzing ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                )}
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    지능형 분석 시작
                  </>
                )}
              </button>

              {reportCount === 0 && (
                <p className="text-[10px] text-orange-400 mt-4 text-center">
                  * 분석을 위한 데이터가 부족합니다. (최소 1건 필요)
                </p>
              )}
            </div>
            
            {/* Background pattern */}
            <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
              <Sparkles className="w-40 h-40" />
            </div>
          </div>
        </div>

        {/* Right: Analysis Result */}
        <div className="lg:col-span-2">
          {analyzing ? (
            <div className="bg-white rounded-[3rem] p-20 border border-muted flex flex-col items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6 p-4 rounded-full bg-primary/10"
              >
                <Sparkles className="text-primary w-12 h-12" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">데이터를 정제하는 중입니다</h3>
              <p className="text-gray-500">회기동의 안전 패턴을 생성모델이 학습하고 있습니다.</p>
            </div>
          ) : analysis ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Summary */}
              <div className="bg-white p-10 rounded-[3rem] border-2 border-primary shadow-sm">
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">분석 요약</h3>
                <p className="text-xl font-medium leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Top Risks */}
                <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100">
                  <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> 주요 위험 요소
                  </h3>
                  <ul className="space-y-4">
                    {analysis.topRisks.map((risk, i) => (
                      <li key={i} className="flex gap-3 text-sm font-bold text-red-800">
                        <span className="text-red-300">0{i+1}</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-primary/10 p-10 rounded-[3rem] border border-primary/20">
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> 행동 지침
                  </h3>
                  <ul className="space-y-4">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 text-sm font-bold text-dark">
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 border border-muted text-center flex flex-col items-center justify-center h-full">
              <div className="bg-muted w-16 h-16 rounded-3xl flex items-center justify-center mb-6">
                <BarChart3 className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">분석 대기 중</h3>
              <p className="text-gray-500">지능형 분석 시작 버튼을 눌러 회기동의 안전 인사이트를 확인하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
