import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Tag, Filter, Shield } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "../lib/utils";

interface Report {
  id: string;
  type: string;
  description: string;
  location: { address: string };
  status: string;
  createdAt: any;
  reporterName: string;
}

export default function DatabasePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredReports = filter === "전체" 
    ? reports 
    : reports.filter(r => r.type === filter);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-dark mb-4">마을 안전 데이터베이스</h1>
          <p className="text-gray-500">회기동 주민들이 함께 만들어가는 실시간 안전 지도 데이터입니다.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-muted overflow-x-auto no-scrollbar">
          {["전체", "시설파손", "우범지역", "어두운 지역", "아동방임의심"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                filter === f ? "bg-primary text-dark" : "text-gray-500 hover:bg-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-muted">
          <Shield className="w-16 h-16 text-muted mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">아직 신고 내역이 없습니다</h3>
          <p className="text-gray-500">첫 번째 안전 지킴이가 되어주세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-[2.5rem] flex flex-col overflow-hidden"
            >
              <div className="bg-muted/30 p-6 flex justify-between items-start">
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  report.type === "아동방임의심" ? "bg-red-100 text-red-600" :
                  report.type === "우범지역" ? "bg-orange-100 text-orange-600" : "bg-primary/20 text-dark"
                )}>
                  {report.type}
                </div>
                <div className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm">
                  #{report.id.slice(0, 5)}
                </div>
              </div>
              
              <div className="p-8 flex-grow">
                <p className="text-gray-700 font-medium mb-6 line-clamp-3 leading-relaxed">
                  "{report.description}"
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="truncate">{report.location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {report.createdAt?.toDate ? 
                        format(report.createdAt.toDate(), "yyyy년 MM월 dd일 HH:mm", { locale: ko }) : 
                        "최근"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {report.reporterName?.[0] || "?"}
                  </div>
                  <span className="text-xs font-bold text-gray-600">{report.reporterName || "익명"}</span>
                </div>
                <div className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  report.status === "pending" ? "text-orange-400" : "text-green-500"
                )}>
                  {report.status === "pending" ? "검토중" : "조치완료"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
