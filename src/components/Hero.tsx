import React from 'react';
import { FileText, PhoneCall, ArrowRight } from 'lucide-react';
import { DesignSettings } from '../types';
import { trackClick } from '../lib/db-service';

interface HeroProps {
  designSettings: DesignSettings;
  onContactClick: () => void;
}

export default function Hero({ designSettings, onContactClick }: HeroProps) {
  
  const handleFormClick = () => {
    trackClick('formClicks');
    window.open('https://naver.me/FLE1OA3O', '_blank', 'noopener,noreferrer');
  };

  const bgStyle = {
    backgroundImage: `linear-gradient(to right, #0B0B0B 0%, rgba(11, 11, 11, 0.88) 60%, rgba(11, 11, 11, 0.65) 100%), url(${designSettings?.heroImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'})`
  };

  let displayTitle = designSettings?.heroTitle || '위반건축물 양성화 전문 건축사사무소';
  if (displayTitle === '위반건축물 양성화 전문 건축사') {
    displayTitle = '위반건축물 양성화 전문 건축사사무소';
  }

  return (
    <section 
      id="hero-section"
      className="relative min-h-[85vh] flex items-center justify-center text-white bg-cover bg-center pt-32 pb-16 overflow-hidden bg-[#0B0B0B]"
      style={bgStyle}
    >
      {/* Background Subtle Gold Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-amber-900/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative architectural grid layout overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 animate-fade-in">
        {/* Subtle Gold Tagline Pill */}
        <div 
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-amber-950/40 backdrop-blur-md text-xs sm:text-sm font-semibold mb-6 text-[#FFD700] tracking-widest font-sans uppercase shadow-[0_0_15px_rgba(255,215,0,0.25)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]" />
          <span>Premium Architecture & Legalization</span>
        </div>

        {/* Hero Headline */}
        <h1 
          id="hero-title"
          className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight drop-shadow-md text-balance text-white"
        >
          {displayTitle}
        </h1>

        {/* Hero Description */}
        <p 
          id="hero-subtitle"
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-normal text-pretty"
        >
          {designSettings?.heroSubtitle || '풍부한 경험과 전문성을 바탕으로 안전하고 신속한 양성화 절차를 지원합니다.'}
        </p>

        {/* CTA Buttons - Rounded with gold glow */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            id="hero-btn-form"
            onClick={handleFormClick}
            className="w-full sm:w-auto px-8 py-4 bg-[#FFD700] hover:bg-[#FFE033] text-black font-black text-sm sm:text-base rounded-full shadow-[0_0_24px_rgba(255,215,0,0.5)] hover:shadow-[0_0_36px_rgba(255,224,51,0.75)] cursor-pointer flex items-center justify-center space-x-2.5 transition-all duration-300 hover:scale-[1.03]"
          >
            <FileText size={19} />
            <span>무료 양성화 검토 신청</span>
            <ArrowRight size={17} />
          </button>

          <button
            id="hero-btn-contact"
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md font-bold text-sm sm:text-base rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2.5 hover:scale-[1.02] hover:border-[#FFD700]/40"
          >
            <PhoneCall size={19} />
            <span>상담 문의</span>
          </button>
        </div>

        {/* Live Badges - Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-8 text-left">
          <div className="p-4 glass-card rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all">
            <p className="text-[#FFD700] font-black text-2xl sm:text-3xl font-mono drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">100%</p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">사전진단 비밀 보장</p>
          </div>
          <div className="p-4 glass-card rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all">
            <p className="text-[#FFD700] font-black text-2xl sm:text-3xl font-mono drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">1:1</p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">대표 건축사 직접 전담</p>
          </div>
          <div className="p-4 glass-card rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all">
            <p className="text-[#FFD700] font-black text-xl sm:text-2xl font-sans drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">정확</p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">전문건축사의 정확한 분석</p>
          </div>
          <div className="p-4 glass-card rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all">
            <p className="text-[#FFD700] font-black text-xl sm:text-2xl font-sans drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">신속</p>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">지자체 밀착 행정 협력</p>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Shadow Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0B0B0B] to-transparent pointer-events-none" />
    </section>
  );
}
