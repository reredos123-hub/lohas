import React from 'react';
import { ClipboardList, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PageContent, DesignSettings } from '../types';

interface GuideViewProps {
  pageContent: PageContent;
  designSettings: DesignSettings;
}

export default function GuideView({ pageContent, designSettings }: GuideViewProps) {
  const content = pageContent?.content || {};

  const steps = [
    { title: '1. 대표 상담', desc: '지번 및 현황 사진 확인을 통한 1차 가설 심사' },
    { title: '2. 현장 정밀 조사', desc: '현장 파견 후 위반 면적 및 구조/소방 규격 실측' },
    { title: '3. 법률/조례 검토', desc: '관할 지자체 건축법 조례 및 허가 요건 맞춤 분석' },
    { title: '4. 정밀 설계도서 작성', desc: '양성화 전담 설계 및 현장조사보고서 작성' },
    { title: '5. 지자체 심의 접수', desc: '구청 건축과 접수 및 밀착 보완 대행' },
    { title: '6. 위반건축물 해제 및 완료', desc: '건축물대장 위반 표기 해제 및 합법화 완료' },
  ];

  return (
    <div id="guide-view" className="bg-[#0B0B0B] text-white min-h-screen pt-28 pb-20 animate-fade-in">
      
      {/* Banner */}
      <div 
        className="text-white py-16 px-4 bg-cover bg-center relative border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 11, 11, 0.95), rgba(11, 11, 11, 0.8)), url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-white">
            {pageContent?.title || '위반건축물 양성화 종합 안내'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal">
            {pageContent?.subtitle || '어렵고 복잡한 위반건축물 해결, 절차부터 요건까지 쉽게 풀어 드립니다.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Section 1: What is a violation? */}
        <div className="glass-card rounded-2xl border border-[#FFD700]/20 p-6 sm:p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#FFD700]/20 rounded-2xl text-[#FFD700] shrink-0 border border-[#FFD700]/30">
              <AlertTriangle size={26} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white mb-3">
                {content.whatIsViolation?.title || '위반건축물(불법건축물)이란?'}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {content.whatIsViolation?.description || '허가를 받지 않거나 신고를 하지 않고 무단으로 신축, 증축한 경우를 의미합니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Targets for Regularization */}
        <div>
          <h2 className="text-xl font-extrabold text-white mb-6 flex items-center space-x-2.5">
            <span className="w-1.5 h-5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
            <span>양성화(합법화) 주요 대상 유형</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content.targetTypes || []).map((target: any, idx: number) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:border-[#FFD700]/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,215,0,0.25)]"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-black mb-4 bg-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.5)]">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-base text-white mb-2">{target.title}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{target.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Progression Timeline */}
        <div className="glass-card rounded-2xl border border-[#FFD700]/20 p-6 sm:p-10">
          <h2 className="text-xl font-extrabold text-white mb-8 border-b border-white/10 pb-4 flex items-center space-x-2.5">
            <span className="w-1.5 h-5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
            <span>양성화 진행 절차 (Timeline)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex space-x-4 items-start relative z-10 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 border-2 bg-amber-950/80 text-[#FFD700] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                >
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base mb-1">{step.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Required Documents & Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Documents Box */}
          <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-white mb-6 flex items-center space-x-2.5">
              <ClipboardList className="text-[#FFD700]" />
              <span>준비 서류 (기본 준비물)</span>
            </h3>

            <ul className="space-y-4">
              {(content.documents || []).map((doc: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">{idx + 1}</span>
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Duration Box */}
          <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-6 flex items-center space-x-2.5">
                <Clock className="text-[#FFD700]" />
                <span>처리 예상 기간</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-normal">
                {content.duration || '검토에 보통 수주가 소요됩니다.'}
              </p>
            </div>

            <div className="bg-amber-950/30 rounded-xl p-4 border border-[#FFD700]/20 flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
              <ShieldCheck size={22} className="text-[#FFD700] shrink-0 mt-0.5" />
              <span>로하스건축사사무소는 위반건축물 양성화에 필요한 모든 서류와 도면등을 다이렉트로 원스톱 조율하여 처리 일정을 최단 기간으로 단축해 드립니다.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
