import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, Send, AlertCircle, CheckCircle2, X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { cn } from "../lib/utils";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "시설파손",
    description: "",
    address: "",
    photo: null as File | null
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const types = ["시설파손", "우범지역", "어두운 지역", "아동방임의심", "불법주정차", "기타"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ ...formData, photo: null });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      alert("Firebase 설정이 완료되지 않았습니다. 오른쪽에 있는 'Set up Firebase' 버튼을 눌러 설정을 진행하고 이용약관에 동의해주세요.");
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, upload photo to Firebase Storage and get URL
      // For this prototype, we'll store metadata
      
      await addDoc(collection(db, "reports"), {
        type: formData.type,
        description: formData.description,
        location: {
          address: formData.address,
          lat: 37.5925,
          lng: 127.0531
        },
        status: "pending",
        createdAt: serverTimestamp(),
        reporterId: auth?.currentUser?.uid || "anonymous",
        reporterName: auth?.currentUser?.displayName || "익명 주민",
        // photoUrl: uploadedUrl
      });

      setSuccess(true);
      setFormData({ type: "시설파손", description: "", address: "", photo: null });
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert("신고 제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3.5rem] shadow-xl border-2 border-primary/20"
        >
          <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-primary w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">신고가 완료되었습니다!</h2>
          <p className="text-gray-500 mb-8">
            회기동의 안전을 지키기 위한 귀하의 소중한 제보에 감사드립니다.<br />
            관리자가 확인 후 조치하도록 하겠습니다.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="btn-primary w-full"
          >
            추가 신고하기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-dark mb-4">위험 요소 신고하기</h1>
        <p className="text-gray-500">
          발견하신 위험 상황이나 방임이 의심되는 아동에 대한 정보를 공유해주세요. 
          귀하의 정보는 익명으로 처리될 수 있으며, 동네 안전 개선에 직접적으로 기여합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-muted">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-bold text-dark mb-3">신고 유형</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium border-2 transition-all",
                      formData.type === t 
                        ? "border-primary bg-primary/10 text-dark shadow-sm" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-muted"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-dark mb-3">상세 내용</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="어떤 위험 요소가 있나요? 자세히 설명해주세요."
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-dark mb-3">발견 위치</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="예: 회기로 13길 45, 세탁소 앞 골목"
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-bold text-dark mb-3">사진 첨부 (선택)</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed border-muted rounded-[2rem] p-10 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all cursor-pointer overflow-hidden relative min-h-[200px]",
                  previewUrl && "border-primary bg-primary/5 border-solid"
                )}
              >
                <AnimatePresence mode="wait">
                  {previewUrl ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="bg-white/90 p-3 rounded-full text-red-500 hover:bg-white transition-all shadow-lg"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <Camera className="w-12 h-12 mb-4" />
                      <p className="text-sm font-medium">사진을 드래그하거나 클릭하여 업로드</p>
                      <p className="text-xs mt-2 uppercase tracking-widest opacity-50">JPG, PNG (MAX. 5MB)</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-lg shadow-lg shadow-primary/20"
            >
              {loading ? "제출 중..." : "신고 제출하기"}
              {!loading && <Send className="w-5 h-5 ml-2" />}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-secondary/30 p-8 rounded-[2.5rem] border border-secondary/50">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500 w-5 h-5" />
              신고 가이드
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                위치를 상세하게 기재해주시면 빠른 해결에 도움이 됩니다.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                아동 방임 의심 사례의 경우, 개인정보 보호를 위해 아동의 얼굴이 직접적으로 드러나는 사진은 가급적 지양해주세요.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                긴급한 상황(아동 학대 현장 등)은 112로 직접 신고해주세요.
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-muted shadow-sm">
            <h3 className="text-lg font-bold mb-4">신고 처리 절차</h3>
            <div className="space-y-4">
              {[
                { step: "01", title: "접수", desc: "주민 제보 접수" },
                { step: "02", title: "분석", desc: "AI 및 관리자 검토" },
                { step: "03", title: "조치", desc: "유관 기관 협력 및 조치" }
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <div className="text-2xl font-black text-gray-100">{s.step}</div>
                  <div>
                    <div className="font-bold text-sm">{s.title}</div>
                    <div className="text-xs text-gray-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
