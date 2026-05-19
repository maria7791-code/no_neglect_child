import React from "react";
import { motion } from "framer-motion";
import { Shield, Home, Phone, Info, AlertTriangle, Heart, MapPin } from "lucide-react";

export default function ResourcesPage() {
  const safeSpaces = [
    { name: "회기동 주민센터", type: "공공기관", address: "회기로 13길 10", phone: "02-2127-1111" },
    { name: "회기 파출소", type: "경찰", address: "회기로 15길 5", phone: "02-112" },
    { name: "경희문구", type: "아동지킴이집", address: "경희대로 12", phone: "02-966-xxxx" },
    { name: "회기24시 편의점", type: "아동지킴이집", address: "회기로 145", phone: "02-xxx-xxxx" }
  ];

  const guides = [
    {
      title: "아동 방임이란 무엇인가요?",
      desc: "보호자가 아동에게 위험한 환경을 방치하거나, 기본적인 의식주를 제공하지 않는 행위, 학교를 보내지 않는 행위 등을 포함합니다.",
      icon: Info
    },
    {
      title: "이런 경우 신고해주세요",
      desc: "계절에 맞지 않는 얇은 옷을 입고 밤늦게 거리를 배회하는 아이, 몸에 상처가 있거나 씻지 못한 흔적이 역력한 아이를 발견했을 때.",
      icon: AlertTriangle
    },
    {
      title: "신고 후 절차는 어떻게 되나요?",
      desc: "신고된 내용은 지역아동보호전문기관과 경찰에 전달되며, 전문가들이 가정 환경을 조사하고 아동의 안전을 확보합니다.",
      icon: Shield
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl font-extrabold mb-6">아동 안전 리소스</h1>
        <p className="text-lg text-gray-500">
          방임된 아이들을 돕기 위한 지식과 우리 동네 안전 공간 정보를 확인하세요. 
          여러분의 관심이 아이들의 내일을 바꿀 수 있습니다.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {guides.map((guide, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-muted relative overflow-hidden"
          >
            <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <guide.icon className="text-primary w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-4">{guide.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{guide.desc}</p>
            <div className="absolute -bottom-6 -right-6 text-gray-50 opacity-50">
              <guide.icon className="w-24 h-24" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Safe Spaces Section */}
      <div className="bg-dark rounded-[4rem] p-12 lg:p-20 text-white mb-24 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary p-3 rounded-2xl text-dark">
              <Home className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">우리 동네 아동 지킴이집</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mb-12">
            지킴이집은 아이들이 위급한 상황이나 낯선 사람의 위협으로부터 몸을 피할 수 있도록 지정된 
            안전한 장소입니다. 아이들에게 위치를 미리 알려주세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeSpaces.map((space, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/20 transition-all">
                <div className="text-primary text-xs font-black mb-2 uppercase tracking-tighter">{space.type}</div>
                <h4 className="text-lg font-bold mb-4">{space.name}</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {space.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {space.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Final Message */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-6 bg-secondary/30 rounded-full mb-8">
          <Heart className="text-primary w-10 h-10 fill-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">"회기동의 아이들은 우리 모두의 아이입니다."</h2>
        <p className="text-gray-500">당신의 눈길 하나가 한 아이의 우주를 구할 수 있습니다.</p>
      </div>
    </div>
  );
}
