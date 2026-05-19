import { motion } from "framer-motion";
import { Shield, AlertTriangle, Users, MapPin, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "../lib/utils";

export default function Home() {
  const features = [
    {
      title: "위험 지역 신고",
      description: "동네 곳곳의 위험 요소를 사진과 위치 정보와 함께 쉽고 빠르게 신고하세요.",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      link: "/report"
    },
    {
      title: "안전 데이터베이스",
      description: "우리 동네의 안전 상태를 확인하고 다른 주민들의 신고 내용을 공유받으세요.",
      icon: MapPin,
      color: "bg-blue-50 text-blue-600",
      link: "/database"
    },
    {
      title: "아동 안전 공간",
      description: "아이들이 위급 상황 시 도움을 받을 수 있는 '지킴이집' 정보를 확인하세요.",
      icon: Shield,
      color: "bg-green-50 text-green-600",
      link: "/resources"
    }
  ];

  return (
    <div className="bg-[#F9FBFA]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                <Heart className="w-4 h-4" />
                <span>경희대학교 시민과학 '소금제비' 프로젝트</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-dark leading-tight mb-6">
                아이들이 <span className="text-primary">안심하고</span><br />
                다닐 수 있는 회기동
              </h1>
              <p className="text-xl text-gray-600 mb-10 mx-auto">
                방임된 아이들이 없는 동네, 누구나 안전을 살피는 공동체를 함께 만들어갑니다.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/report" className="btn-primary text-lg px-8 py-4">
                  지금 위험 신고하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/database" className="btn-outline text-lg px-8 py-4">
                  신고 현황 보기
                </Link>
              </div>
            </motion.div>
          </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="section-title">함께 만드는 안전 공동체</h2>
            <p className="text-gray-500">
              우리의 작은 관심이 아이들에게는 큰 울타리가 됩니다. 주요 기능을 통해 마을의 안전을 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 rounded-[2rem] flex flex-col items-center text-center"
              >
                <div className={cn("p-4 rounded-2xl mb-6", feature.color)}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 mb-6 flex-grow">{feature.description}</p>
                <Link to={feature.link} className="flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all">
                  둘러보기 <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-xl flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                아동 방임은 <br />
                <span className="text-primary underline decoration-secondary underline-offset-8">사회 전체</span>의 관심이 필요합니다
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                회기동은 경희대학교와 주거 단지가 모여있는 특색 있는 동네입니다. 
                많은 아이들이 학원과 학교를 오가는 이곳에서, 골목 사이사이에 숨은 위험이나 
                보호자의 돌봄을 받지 못하는 아이들을 발견한다면 즉시 알려주세요.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-lg mt-1">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">지역사회 네트워크</h4>
                    <p className="text-sm text-gray-500">주민들이 직접 참여하여 실시간으로 위험을 감시합니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-lg mt-1">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">AI 패턴 분석</h4>
                    <p className="text-sm text-gray-500">신고된 데이터를 AI가 분석하여 우범 지역을 사전에 파악합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1080&auto=format&fit=crop" 
                alt="Community care" 
                className="rounded-[3rem] shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
